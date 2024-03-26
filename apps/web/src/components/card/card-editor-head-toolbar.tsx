'use client';
import { Tab, Tabs, TabsHeader } from '../material-tailwind';
import {
  EditMode,
  SketchMode,
  PencilInfo,
  EraserInfo,
} from '@/hooks/card/useCardEditor';
import CardEditorHeadToolbarEraser from './card-editor-head-toolbar-eraser';
import CardEditorHeadToolbarPencil from './card-editor-head-toolbar-pencil';

const modes: EditMode[] = ['text', 'sketch'];
const sketchModes: SketchMode[] = ['pencil', 'eraser'];
interface CardEditorHeadToolbarProps {
  editMode: EditMode;
  setEditMode: (mode: EditMode) => void;
  sketchMode: SketchMode;
  setSketchMode: (mode: SketchMode) => void;
  pencilInfo: PencilInfo;
  setPencilInfo: (info: PencilInfo) => void;
  eraserInfo: EraserInfo;
  setEraserInfo: (info: EraserInfo) => void;
}
function CardEditorHeadToolbar({
  editMode,
  setEditMode,
  sketchMode,
  setSketchMode,
  pencilInfo,
  setPencilInfo,
  eraserInfo,
  setEraserInfo,
}: CardEditorHeadToolbarProps) {
  return (
    <div className="flex w-full justify-between">
      <div className="flex items-center">
        <Tabs value={editMode}>
          <TabsHeader
            className="bg-gray-900"
            indicatorProps={{
              className: 'bg-gray-100/10 shadow-none !text-gray-900',
            }}
          >
            {modes.map((value) => (
              <Tab
                key={value}
                value={value}
                onClick={() => setEditMode(value)}
                className={
                  editMode === value ? 'text-gray-100' : 'text-gray-400'
                }
              >
                {value}
              </Tab>
            ))}
          </TabsHeader>
        </Tabs>
        {editMode === 'sketch' &&
          sketchModes.map((value) => (
            <button
              key={value}
              onClick={() => setSketchMode(value)}
              className={`ml-2 rounded-full px-2 py-1 ${
                sketchMode === value
                  ? 'bg-gray-800 text-gray-400'
                  : 'bg-gray-900 text-gray-100'
              }`}
            >
              {value}
            </button>
          ))}
      </div>

      {editMode === 'sketch' && (
        <>
          {sketchMode === 'pencil' ? (
            <CardEditorHeadToolbarPencil
              pencilInfo={pencilInfo}
              setPencilInfo={setPencilInfo}
            />
          ) : (
            <CardEditorHeadToolbarEraser
              eraserInfo={eraserInfo}
              setEraserInfo={setEraserInfo}
            />
          )}
        </>
      )}
    </div>
  );
}

export default CardEditorHeadToolbar;
