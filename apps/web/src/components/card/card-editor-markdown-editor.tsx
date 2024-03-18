'use client';
import '@blocknote/core/fonts/inter.css';
import {
  BlockNoteView,
  darkDefaultTheme,
  useCreateBlockNote,
} from '@blocknote/react';
import '@blocknote/react/style.css';
import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';

interface CardEditorMarkdownEditorProps {
  cardId: string;
}
function CardEditorMarkdownEditor({ cardId }: CardEditorMarkdownEditorProps) {
  const [status, setStatus] = useState<string>('disconnected');
  const [userName, setUserName] = useState<string>('My Username');
  const [doc] = useState(new Y.Doc());
  const [provider] = useState(
    new SocketIOProvider(
      'ws://localhost:8080',
      `card-${cardId}`,
      doc,
      {
        autoConnect: true,
        auth: {
          test: 'test',
        },
      },

    )
  );

  const editor = useCreateBlockNote({
    // ...
    collaboration: {
      // The Yjs Provider responsible for transporting updates:
      provider,
      // Where to store BlockNote data in the Y.Doc:
      fragment: doc.getXmlFragment('card-content'),
      // Information (name and color) for this user:
      user: {
        name: userName,
        color: '#0066ff',
      },
    },
    // ...
  });

  useEffect(() => {
    provider.on('sync', (isSync: boolean) =>
      console.log('websocket sync', isSync),
    );
    provider.on('status', ({ status: _status }: { status: string }) => {
      if (_status) setStatus(_status);
    });

    return () => {
      provider.disconnect();
    };
  }, []);

  return (
    <div className="text-white">
      <input
        className="text-gray-900"
        type="text"
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
          editor.updateCollaborationUserInfo({
            name: e.target.value,
            color: '#0066ff',
          });
        }}
      />

      <p>State: {status}</p>
      {!(status === 'connected') ? (
        <>
          <button onClick={() => provider.connect()}>Connect</button>
        </>
      ) : (
        !!doc && <BlockNoteView theme={darkDefaultTheme} editor={editor} />
      )}
    </div>
  );
}

export default CardEditorMarkdownEditor;
