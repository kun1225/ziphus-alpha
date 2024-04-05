'use client';
import '@blocknote/core/fonts/inter.css';
import {
  BlockNoteView,
  darkDefaultTheme,
  useCreateBlockNote,
} from '@blocknote/react';
import '@blocknote/react/style.css';
import useUpdateCardContent from '@/hooks/card/useUpdateCardContent';
import { SocketIOProvider } from '@repo/y-socket-io';
import * as Y from 'yjs';
import { useRef, useState } from 'react';
import {
  BlockNoteSuggestionMenu,
  schema,
} from '../blocknote/block-note-setting';

interface CardEditorMarkdownEditorProps {
  cardId: string;
  accountName: string;
  onContentSizeChange: (height: number) => void;
  provider: SocketIOProvider;
  doc: Y.Doc;
}
function CardEditorMarkdownEditor({
  cardId,
  accountName,
  onContentSizeChange,
  provider,
  doc,
}: CardEditorMarkdownEditorProps) {
  const tryUpdateCardContent = useUpdateCardContent(cardId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fragment] = useState(doc.getXmlFragment('card-content'));

  const editor = useCreateBlockNote({
    schema,
    collaboration: {
      provider,
      fragment,
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
    const offsetHeight = containerRef.current.offsetHeight;
    onContentSizeChange(offsetHeight);
  };

  return (
    <div
      className=" h-fit w-full text-white"
      ref={containerRef}
      onClick={() => editor.focus()}
    >
      <BlockNoteView
        theme={darkDefaultTheme}
        editor={editor}
        onChange={onChange}
        slashMenu={false}
      >
        <BlockNoteSuggestionMenu editor={editor} />
      </BlockNoteView>
    </div>
  );
}

export default CardEditorMarkdownEditor;
