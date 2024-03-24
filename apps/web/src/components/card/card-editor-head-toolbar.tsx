"use client";
import { Tab, Tabs, TabsHeader } from "../material-tailwind";
import { Mode } from "./card-editor";

const modes: Mode[] = ["text", "sketch"];

interface CardEditorHeadToolbarProps {
  editMode: Mode;
  setEditMode: (mode: Mode) => void;
}
function CardEditorHeadToolbar({
  editMode,
  setEditMode,
}: CardEditorHeadToolbarProps) {
  return (
    <div className="w-64">
      <Tabs value={editMode}>
        <TabsHeader
          className="bg-gray-900"
          indicatorProps={{
            className: "bg-gray-100/10 shadow-none !text-gray-900",
          }}
        >
          {modes.map((value) => (
            <Tab
              key={value}
              value={value}
              onClick={() => setEditMode(value)}
              className={editMode === value ? "text-gray-100" : "text-gray-400"}
            >
              {value}
            </Tab>
          ))}
        </TabsHeader>
      </Tabs>
    </div>
  );
}

export default CardEditorHeadToolbar;
