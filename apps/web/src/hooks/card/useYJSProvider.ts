import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';
import { getCookie } from 'cookies-next';

function useYJSProvide({
  cardId,
  spaceId,
}: {
  cardId?: string;
  spaceId?: string;
}) {
  if (!cardId && !spaceId) {
    throw new Error('cardId or spaceId is required');
  }
  if (cardId && spaceId) {
    throw new Error('cardId and spaceId cannot be used at the same time');
  }
  const [status, setStatus] = useState<string>('disconnected');
  const [doc] = useState(new Y.Doc());
  const [provider] = useState(
    new SocketIOProvider(
      process.env.NEXT_PUBLIC_WS_ENDPOINT || 'ws://localhost:8080',
      cardId ? `card-${cardId}` : `space-${spaceId}`,
      doc,
      {
        autoConnect: true,
        auth: {
          authorization: getCookie('authorization'),
          cardId,
          spaceId,
        },
      },
    ),
  );

  useEffect(() => {
    provider.on('sync', (isSync: boolean) =>
      console.log('websocket sync', isSync),
    );
    provider.on('status', ({ status: _status }: { status: string }) => {
      if (_status) setStatus(_status);
    });

    return () => {
      provider.disconnect();
      provider.destroy();
    };
  }, []);

  return {
    doc,
    provider,
    status,
  };
}

export default useYJSProvide;
