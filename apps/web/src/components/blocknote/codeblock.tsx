import { useEffect, useRef } from "react";
import { MdCode } from "react-icons/md";
import { insertOrUpdateBlock } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import CodeTextareaEditor from "@uiw/react-textarea-code-editor";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/nextui";
import { schema } from "./block-note-setting";

const languages = [
  "plaintext",
  "arduino",
  "bash",
  "basic",
  "c",
  "clike",
  "cpp",
  "csharp",
  "css",
  "diff",
  "go",
  "ini",
  "java",
  "javascript",
  "json",
  "kotlin",
  "less",
  "lua",
  "makefile",
  "markdown",
  "html/xml",
  "markup-templating",
  "objectivec",
  "perl",
  "php",
  "python",
  "r",
  "regex",
  "ruby",
  "rust",
  "sass",
  "scss",
  "sql",
  "swift",
  "typescript",
  "vbnet",
  "yaml",
];

export const insertCodeblock = (editor: typeof schema.BlockNoteEditor) => ({
  title: "CodeBlock (開發中)",
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
    propSchema: {
      language: {
        default: "plaintext",
        values: languages,
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const code = (props.block.content?.[0] as any)?.text || "";

      const selectedLanguage = props.block.props.language;

      return (
        <div className=" relative flex h-fit w-full flex-col gap-2">
          <Dropdown className=" text-white">
            <DropdownTrigger>
              <Button variant="flat" size="sm" className="w-fit px-4">
                Language: {selectedLanguage}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Language Select"
              className="max-h-64 overflow-y-auto"
            >
              {languages.map((language) => (
                <DropdownItem
                  key={language}
                  onClick={() =>
                    props.editor.updateBlock(props.block, {
                      type: "codeblock",
                      props: { language },
                    })
                  }
                >
                  {language}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <div className="relative">
            <CodeTextareaEditor
              value={code}
              language={selectedLanguage}
              placeholder="enter some code here..."
              className="text-md"
              padding={10}
              style={{
                lineHeight: "18px",
                fontSize: "12px",
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                pointerEvents: "none",
              }}
            />

            <pre
              className=" absolute left-0 top-0 rounded bg-opacity-0 text-white text-opacity-0 caret-white"
              style={{
                padding: "10px",
                lineHeight: "18px",
                fontSize: "12px",
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
              }}
              ref={props.contentRef}
            >
              <code></code>
            </pre>
          </div>
        </div>
      );
    },
  }
);
