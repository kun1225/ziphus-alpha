'use client';
import '@blocknote/core/fonts/inter.css';
import {
  BlockNoteView,
  darkDefaultTheme,
  useCreateBlockNote,
} from '@blocknote/react';
import '@blocknote/react/style.css';
import useUpdateCardContent from '@/hooks/card/useUpdateCardContent';
import { SocketIOProvider } from 'y-socket.io';
import * as Y from 'yjs';
import { useRef } from 'react';

interface CardEditorMarkdownEditorProps {
  cardId: string;
  accountName: string;
  onCardSizeChange: (width: number, height: number) => void;
  provider: SocketIOProvider;
  doc: Y.Doc;
}
function CardEditorMarkdownEditor({
  cardId,
  accountName,
  onCardSizeChange,
  provider,
  doc,
}: CardEditorMarkdownEditorProps) {
  const tryUpdateCardContent = useUpdateCardContent(cardId);
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment(`card-content-${cardId}`),
      user: {
        name: accountName,
        color: '#0066ff',
      },
    },
  });

  const onChange = async () => {
    const html = await editor.blocksToHTMLLossy(editor.document);
    tryUpdateCardContent(html);
    if (!containerRef.current) return;
    const offsetWidth = containerRef.current.offsetWidth;
    const offsetHeight = containerRef.current.offsetHeight;
    onCardSizeChange(offsetWidth, offsetHeight);
  };

  return (
    <div className=" h-fit w-fit text-white" ref={containerRef}>
      {!!doc && (
        <BlockNoteView
          theme={darkDefaultTheme}
          editor={editor}
          onChange={onChange}
        />
      )}
    </div>
  );
}

export default CardEditorMarkdownEditor;
