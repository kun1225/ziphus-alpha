import { createReactBlockSpec } from '@blocknote/react';
import { insertOrUpdateBlock } from '@blocknote/core';
import { schema } from './block-note-setting';
import { MdCode } from 'react-icons/md';

export const insertCode = (editor: typeof schema.BlockNoteEditor) => ({
  title: 'Code (開發中)',
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: 'codeblock',
    });
  },
  aliases: ['codeblock'],
  group: 'Other',
  icon: <MdCode />,
});

export const Code = createReactBlockSpec(
  {
    type: 'codeblock',
    propSchema: {},
    content: 'inline',
  },
  {
    render: (props) => {
      return (
        <pre className=" relative p-2 bg-gray-900 border border-gray-200 text-white rounded">
          <code ref={props.contentRef}></code>
        </pre>
      );
    },
  },
);
