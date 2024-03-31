'use client';
import {
  EditMode,
  SketchMode,
  PencilInfo,
  EraserInfo,
} from '@/components/card/card-editor-sketch-panel';
import SpaceToolbarLayerEraser from './space-toolbar-layer-eraser';
import SpaceToolbarLayerPencil from './space-toolbar-layer-pencil';
import { FaEraser, FaPencil } from 'react-icons/fa6';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import useCreateSpaceCard from '@/hooks/space/useCreateSpaceCard';
import useCreateCard from '@/hooks/card/useCreateCard';
import { SpaceGetByIdResponseDTO } from '@repo/shared-types';
import ToolbarItemButton from './space-toolbar-item-button';
import { View } from '@/models/view';
import ToolbarItemAddCardButton from './space-toolbar-add-card-button';

interface SpaceToolbarProps {
  isCardFocused: boolean;
  editMode: EditMode;
  setEditMode: (mode: EditMode) => void;
  sketchMode: SketchMode;
  setSketchMode: (mode: SketchMode) => void;
  pencilInfo: PencilInfo;
  setPencilInfo: (info: PencilInfo) => void;
  eraserInfo: EraserInfo;
  setEraserInfo: (info: EraserInfo) => void;
  mutateCreateSpaceCard: ReturnType<typeof useCreateSpaceCard>;
  mutateCreateCard: ReturnType<typeof useCreateCard>;
  space: SpaceGetByIdResponseDTO['space'];
  setSpace: (space: SpaceGetByIdResponseDTO['space']) => void;
  viewRef: React.MutableRefObject<View>;
  editorRef: React.RefObject<HTMLDivElement>;

}
function SpaceToolbar({
  isCardFocused,
  editMode,
  setEditMode,
  sketchMode,
  setSketchMode,
  pencilInfo,
  setPencilInfo,
  eraserInfo,
  setEraserInfo,
  mutateCreateSpaceCard,
  mutateCreateCard,
  space,
  setSpace,
  viewRef,
  editorRef,
}: SpaceToolbarProps) {
  const [
    selectedId,
    setSelectedId,
  ] = useState(0);

  useEffect(() => {
    if (!isCardFocused) {
      setEditMode('text');
      setSelectedId(0);
    }
    if (editMode === 'text') {
      setSelectedId(0);
    } else if (editMode === 'sketch' && sketchMode === 'pencil') {
      setSelectedId(1);
    } else if (editMode === 'sketch' && sketchMode === 'eraser') {
      setSelectedId(2);
    }
  }, [isCardFocused, editMode, sketchMode]);

  return (
    <>
      {/** 第一層 */}
      <div className="w-fit h-fit flex flex-col items-center absolute right-2 top-1/2 -translate-y-1/2 z-50">
        {/** 文字編輯 0 */}
        <ToolbarItemButton
          isFocused={selectedId === 0}
          onClick={() => setEditMode('text')}
        >
          <IoDocumentTextOutline />
        </ToolbarItemButton>
        {/**  鉛筆 1 */}
        {
          isCardFocused && (
            <ToolbarItemButton
              isFocused={selectedId === 1}
              onClick={() => {
                setEditMode('sketch');
                setSketchMode('pencil');
              }}
            >
              <FaPencil />
            </ToolbarItemButton>
          )
        }
        {/** 橡皮擦 2 */}
        {
          isCardFocused && (
            <ToolbarItemButton
              isFocused={selectedId === 2}
              onClick={() => {
                setEditMode('sketch');
                setSketchMode('eraser');
              }}
            >
              <FaEraser />
            </ToolbarItemButton>
          )
        }
        {/** 新增題目 3 */}
        {
          !isCardFocused && (
            <ToolbarItemAddCardButton
              viewRef={viewRef}
              mutateCreateSpaceCard={mutateCreateSpaceCard}
              mutateCreateCard={mutateCreateCard}
              setSpace={setSpace}
              space={space}
              editorRef={editorRef}
            />
          )
        }

      </div>

      {/** 第二層 */}
      <div className="w-fit h-fit flex flex-col items-center absolute right-16 top-1/2 -translate-y-1/2 z-50">
        {
          editMode === 'sketch' && sketchMode === 'pencil' && (
            <SpaceToolbarLayerPencil
              pencilInfo={pencilInfo}
              setPencilInfo={setPencilInfo}
            />
          )
        }
        {
          editMode === 'sketch' && sketchMode === 'eraser' && (
            <SpaceToolbarLayerEraser
              eraserInfo={eraserInfo}
              setEraserInfo={setEraserInfo}
            />
          )
        }
      </div>
    </>
  );
}

export default SpaceToolbar;
