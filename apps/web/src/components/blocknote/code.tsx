import { MdCode } from "react-icons/md";
import { insertOrUpdateBlock } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { schema } from "./block-note-setting";

export const insertCode = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Code (開發中)",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "codeblock",
    });
  },
  aliases: ["codeblock"],
  group: "Other",
  icon: <MdCode />,
});

export const Code = createReactBlockSpec(
  {
    type: "codeblock",
    propSchema: {},
    content: "inline",
  },
  {
    render: (props) => {
      return (
        <pre className=" relative rounded border border-gray-200 bg-gray-900 p-2 text-white">
          <code ref={props.contentRef}></code>
        </pre>
      );
    },
  }
);
