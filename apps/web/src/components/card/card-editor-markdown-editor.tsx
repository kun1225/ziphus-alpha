import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteView,
  darkDefaultTheme,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";
import { useEffect } from "react";

interface CardEditorMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}
function CardEditorMarkdownEditor({
  value,
  onChange,
}: CardEditorMarkdownEditorProps) {
  const editor = useCreateBlockNote();
  const handleChange = async () => {
    const markdownFromBlocks = await editor.blocksToMarkdownLossy(
      editor.document,
    );
    onChange(markdownFromBlocks);
  };

  useEffect(() => {
    async function loadValue() {
      const textCursorPosition = editor.getTextCursorPosition();
      console.log(textCursorPosition);
      const blocks = await editor.tryParseMarkdownToBlocks(value);
      editor.replaceBlocks(editor.document, blocks);
    }
    loadValue();
  }, [value]);

  return (
    <BlockNoteView
      theme={darkDefaultTheme}
      editor={editor}
      onInput={handleChange}
    />
  );
}

export default CardEditorMarkdownEditor;
