import { useEffect, useRef } from "react";
import { MdCode } from "react-icons/md";
import { insertOrUpdateBlock } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { schema } from "./block-note-setting";

export const insertCodeblock = (editor: typeof schema.BlockNoteEditor) => ({
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

export const Codeblock = createReactBlockSpec(
  {
    type: "codeblock",
    propSchema: {},
    content: "inline",
  },
  {
    render: (props) => {
      const inputRef = useRef<HTMLElement>(null);

      useEffect(() => {
        if (inputRef.current) {
          props.contentRef(inputRef.current);
        }

        function test(event: KeyboardEvent) {
          console.log(event);
        }

        inputRef.current?.addEventListener("keydown", test);

        return () => {
          inputRef.current?.removeEventListener("keydown", test);
        };
      }, [inputRef.current]);

      return (
        <pre className=" relative rounded border border-gray-200 bg-gray-900 p-2 text-white">
          <code ref={inputRef}></code>
        </pre>
      );
    },
  }
);
