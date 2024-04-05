import * as Y from "yjs";
import * as bc from "lib0/broadcastchannel";
import * as AwarenessProtocol from "y-protocols/awareness";
import { Observable } from "lib0/observable";
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import { AwarenessChange } from "../types";

export interface ProviderConfiguration {
  /**
   * (Optional) An existent awareness, by default is a new AwarenessProtocol.Awareness instance
   */
  awareness?: AwarenessProtocol.Awareness;
  /**
   * (optional) Specify the number of milliseconds to synchronize, by default is -1 (this disable resync interval)
   */
  resyncInterval?: number;
  /**
   * (Optional) This boolean disable the broadcast channel functionality, by default is false (broadcast channel enabled)
   */
  disableBc?: boolean;
  /**
   * (Optional) Add the authentication data
   */
  auth?: { [key: string]: any };
}

/**
 * The socket io provider class to sync a document
 */
export class SocketIOProvider extends Observable<string> {
  /**
   * The room name
   * @type {string}
   * @private
   */
  private readonly roomName: string;
  /**
   * The broadcast channel room
   * @type {string}
   * @private
   */
  private readonly _broadcastChannel: string;
  /**
   * The socket connection
   * @type {Socket}
   */
  public socket: Socket;
  /**
   * The yjs document
   * @type {Y.Doc}
   */
  public doc: Y.Doc;
  /**
   * The awareness
   * @type {AwarenessProtocol.Awareness}
   */
  public awareness: AwarenessProtocol.Awareness;
  /**
   * Disable broadcast channel, by default is false
   * @type {boolean}
   */
  public disableBc: boolean;
  /**
   * The broadcast channel connection status indicator
   * @type {boolean}
   */
  public bcconnected: boolean = false;
  /**
   * The document's sync status indicator
   * @type {boolean}
   * @private
   */
  private _synced: boolean = false;
  /**
   * Interval to emit `sync-step-1` to sync changes
   * @type {ReturnType<typeof setTimeout> | null}
   * @private
   */
  private resyncInterval: ReturnType<typeof setTimeout> | null = null;
  /**
   * Optional overrides for socket.io
   * @type {Partial<ManagerOptions & SocketOptions> | undefined}
   * @private
   */
  private readonly _socketIoOptions:
    | Partial<ManagerOptions & SocketOptions>
    | undefined;

  /**
   * SocketIOProvider constructor
   * @constructor
   * @param {string} url The connection url from server
   * @param {string} roomName The document's room name
   * @param {Y.Doc} doc The yjs document
   * @param {ProviderConfiguration} options Configuration options to the SocketIOProvider
   * @param {Partial<ManagerOptions & SocketOptions> | undefined} socketIoOptions optional overrides for socket.io
   */
  constructor(
    socket: Socket,
    roomName: string,
    doc: Y.Doc = new Y.Doc(),
    {
      awareness = new AwarenessProtocol.Awareness(doc),
      resyncInterval = -1,
      disableBc = false,
      auth = {},
    }: ProviderConfiguration,
    socketIoOptions:
      | Partial<ManagerOptions & SocketOptions>
      | undefined = undefined
  ) {
    super();

    this.doc = doc;
    this.awareness = awareness;
    this.roomName = roomName;

    this._broadcastChannel = `yjs-${roomName}`;

    this.disableBc = disableBc;
    this._socketIoOptions = socketIoOptions;

    this.socket = socket;

    this.doc.on("update", this.onUpdateDoc);

    this.socket.on("disconnect", (event) => this.onSocketDisconnection(event));

    this.socket.on("connect_error", (error) =>
      this.onSocketConnectionError(error)
    );

    this.onSocketConnection(resyncInterval);

    this.initSyncListeners();

    this.initAwarenessListeners();

    this.initSystemListeners();

    awareness.on("update", this.awarenessUpdate);
  }

  /**
   * Broadcast channel room getter
   * @type {string}
   */
  public get broadcastChannel(): string {
    return this._broadcastChannel;
  }

  /**
   * Synchronized state flag getter
   * @type {boolean}
   */
  public get synced(): boolean {
    return this._synced;
  }

  /**
   * Synchronized state flag setter
   */
  public set synced(state) {
    if (this._synced !== state) {
      this._synced = state;
      this.emit("synced", [state]);
      this.emit("sync", [state]);
    }
  }

  private readonly initSyncListeners = (): void => {
    this.socket.on(
      `${this.roomName}-sync-step-1`,
      (stateVector: ArrayBuffer, syncStep2: (update: Uint8Array) => void) => {
        syncStep2(Y.encodeStateAsUpdate(this.doc, new Uint8Array(stateVector)));
        this.synced = true;
      }
    );

    this.socket.on(`${this.roomName}-sync-update`, this.onSocketSyncUpdate);
  };

  private readonly initAwarenessListeners = (): void => {
    this.socket.on(
      `${this.roomName}-awareness-update`,
      (update: ArrayBuffer) => {
        AwarenessProtocol.applyAwarenessUpdate(
          this.awareness,
          new Uint8Array(update),
          this
        );
      }
    );
  };

  private readonly initSystemListeners = (): void => {
    if (typeof window !== "undefined")
      window.addEventListener("beforeunload", this.beforeUnloadHandler);
    else if (typeof process !== "undefined")
      process.on("exit", this.beforeUnloadHandler);
  };

  public connect(): void {
    if (!this.socket.connected) {
      this.emit("status", [{ status: "connecting" }]);
      this.socket.connect();
      if (!this.disableBc) this.connectBc();
      this.synced = false;
    }
  }

  private readonly onSocketConnection = (
    resyncInterval: ProviderConfiguration["resyncInterval"] = -1
  ): void => {
    this.socket.emit("yjs-connect", this.roomName);

    this.socket.on(`yjs-${this.roomName}-connected`, () => {
      this.emit("status", [{ status: "connected" }]);
      this.socket.emit(
        `${this.roomName}-sync-step-1`,
        Y.encodeStateVector(this.doc),
        (update: Uint8Array) => {
          Y.applyUpdate(this.doc, new Uint8Array(update), this);
        }
      );
      if (this.awareness.getLocalState() !== null)
        this.socket.emit(
          `${this.roomName}-awareness-update`,
          AwarenessProtocol.encodeAwarenessUpdate(this.awareness, [
            this.doc.clientID,
          ])
        );
      if (resyncInterval > 0) {
        this.resyncInterval = setInterval(() => {
          if (this.socket.disconnected) return;
          this.socket.emit(
            `${this.roomName}-sync-step-1`,
            Y.encodeStateVector(this.doc),
            (update: Uint8Array) => {
              Y.applyUpdate(this.doc, new Uint8Array(update), this);
            }
          );
        }, resyncInterval);
      }
      this.socket.off(`yjs-${this.roomName}-connected`);
    });
  };

  public disconnect(): void {
    if (this.socket.connected) {
      this.disconnectBc();
    }
  }

  private readonly onSocketDisconnection = (
    event: Socket.DisconnectReason
  ): void => {
    this.emit("connection-close", [event, this]);
    this.synced = false;
    AwarenessProtocol.removeAwarenessStates(
      this.awareness,
      Array.from(this.awareness.getStates().keys()).filter(
        (client) => client !== this.doc.clientID
      ),
      this
    );
    this.emit("status", [{ status: "disconnected" }]);
  };

  private readonly onSocketConnectionError = (error: Error): void => {
    this.emit("connection-error", [error, this]);
  };

  public destroy(): void {
    if (this.resyncInterval != null) clearInterval(this.resyncInterval);
    this.disconnect();
    if (typeof window !== "undefined")
      window.removeEventListener("beforeunload", this.beforeUnloadHandler);
    else if (typeof process !== "undefined")
      process.off("exit", this.beforeUnloadHandler);
    this.awareness.off("update", this.awarenessUpdate);
    this.awareness.destroy();
    this.doc.off("update", this.onUpdateDoc);
    super.destroy();
  }

  private readonly onUpdateDoc = (
    update: Uint8Array,
    origin: SocketIOProvider
  ): void => {
    if (origin !== this) {
      this.socket.emit(`${this.roomName}-sync-update`, update);
      if (this.bcconnected) {
        bc.publish(
          this._broadcastChannel,
          {
            type: "sync-update",
            data: update,
          },
          this
        );
      }
    }
  };

  private readonly onSocketSyncUpdate = (update: ArrayBuffer): void => {
    Y.applyUpdate(this.doc, new Uint8Array(update), this);
  };

  private readonly awarenessUpdate = (
    { added, updated, removed }: AwarenessChange,
    origin: SocketIOProvider | null
  ): void => {
    const changedClients = added.concat(updated).concat(removed);
    this.socket.emit(
      `${this.roomName}-awareness-update`,
      AwarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients)
    );
    if (this.bcconnected) {
      bc.publish(
        this._broadcastChannel,
        {
          type: "awareness-update",
          data: AwarenessProtocol.encodeAwarenessUpdate(
            this.awareness,
            changedClients
          ),
        },
        this
      );
    }
  };

  private readonly beforeUnloadHandler = (): void => {
    AwarenessProtocol.removeAwarenessStates(
      this.awareness,
      [this.doc.clientID],
      "window unload"
    );
  };

  private readonly connectBc = (): void => {
    if (!this.bcconnected) {
      bc.subscribe(this._broadcastChannel, this.onBroadcastChannelMessage);
      this.bcconnected = true;
    }
    bc.publish(
      this._broadcastChannel,
      { type: "sync-step-1", data: Y.encodeStateVector(this.doc) },
      this
    );
    bc.publish(
      this._broadcastChannel,
      { type: "sync-step-2", data: Y.encodeStateAsUpdate(this.doc) },
      this
    );
    bc.publish(
      this._broadcastChannel,
      { type: "query-awareness", data: null },
      this
    );
    bc.publish(
      this._broadcastChannel,
      {
        type: "awareness-update",
        data: AwarenessProtocol.encodeAwarenessUpdate(this.awareness, [
          this.doc.clientID,
        ]),
      },
      this
    );
  };

  private readonly disconnectBc = (): void => {
    bc.publish(
      this._broadcastChannel,
      {
        type: "awareness-update",
        data: AwarenessProtocol.encodeAwarenessUpdate(
          this.awareness,
          [this.doc.clientID],
          new Map()
        ),
      },
      this
    );
    if (this.bcconnected) {
      bc.unsubscribe(this._broadcastChannel, this.onBroadcastChannelMessage);
      this.bcconnected = false;
    }
  };

  private readonly onBroadcastChannelMessage = (
    message: { type: string; data: any },
    origin: SocketIOProvider
  ): void => {
    if (origin !== this && message.type.length > 0) {
      switch (message.type) {
        case "sync-step-1":
          bc.publish(
            this._broadcastChannel,
            {
              type: "sync-step-2",
              data: Y.encodeStateAsUpdate(this.doc, message.data),
            },
            this
          );
          break;

        case "sync-step-2":
          Y.applyUpdate(this.doc, new Uint8Array(message.data), this);
          break;

        case "sync-update":
          Y.applyUpdate(this.doc, new Uint8Array(message.data), this);
          break;

        case "query-awareness":
          bc.publish(
            this._broadcastChannel,
            {
              type: "awareness-update",
              data: AwarenessProtocol.encodeAwarenessUpdate(
                this.awareness,
                Array.from(this.awareness.getStates().keys())
              ),
            },
            this
          );
          break;

        case "awareness-update":
          AwarenessProtocol.applyAwarenessUpdate(
            this.awareness,
            new Uint8Array(message.data),
            this
          );
          break;

        default:
          break;
      }
    }
  };
}
