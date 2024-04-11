import {
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
} from "@blocknote/core";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
// import { Alert, insertAlert } from './alert';
import { Codeblock, insertCodeblock } from "./codeblock";

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    // alert: Alert,
    codeblock: Codeblock,
  },
});

export function BlockNoteSuggestionMenu({
  editor,
}: {
  editor: typeof schema.BlockNoteEditor;
}) {
  return (
    <SuggestionMenuController
      triggerCharacter={"/"}
      getItems={async (query) =>
        // Gets all default slash menu items and `insertAlert` item.
        filterSuggestionItems(
          [
            ...getDefaultReactSlashMenuItems(editor),
            // insertAlert(editor),
            insertCodeblock(editor),
          ],
          query
        )
      }
    />
  );
}
