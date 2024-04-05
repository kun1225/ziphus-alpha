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
import { SpaceDto } from '@repo/shared-types';
import ToolbarItemButton from './space-toolbar-item-button';
import { View } from '@/models/view';
import ToolbarItemAddCardButton from './space-toolbar-add-card-button';
import ToolbarItemDeleteCardButton from './space-toolbar-delete-card-button';
import useDeleteSpaceCard from '@/hooks/space/useDeleteSpaceCard';

interface SpaceToolbarProps {
  focusSpaceCardId: string | null;
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
  mutateDeleteSpaceCard: ReturnType<typeof useDeleteSpaceCard>;
  space: SpaceDto;
  setSpace: (space: SpaceDto) => void;
  viewRef: React.MutableRefObject<View>;
  editorRef: React.RefObject<HTMLDivElement>;
}
function SpaceToolbar({
  focusSpaceCardId,
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
  mutateDeleteSpaceCard,
  space,
  setSpace,
  viewRef,
  editorRef,
}: SpaceToolbarProps) {
  const [selectedId, setSelectedId] = useState(0);

  useEffect(() => {
    if (!focusSpaceCardId) {
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
  }, [focusSpaceCardId, editMode, sketchMode]);

  return (
    <>
      {/** 第一層 */}
      <div className="absolute right-2 top-1/2 z-50 flex h-fit w-fit -translate-y-1/2 flex-col items-center">
        {/** 文字編輯 0 */}
        {focusSpaceCardId && (
          <ToolbarItemButton
            isFocused={selectedId === 0}
            onClick={(event) => {
              event.stopPropagation();
              setEditMode('text');
            }}
          >
            <IoDocumentTextOutline />
          </ToolbarItemButton>
        )}
        {/**  鉛筆 1 */}
        {focusSpaceCardId && (
          <ToolbarItemButton
            isFocused={selectedId === 1}
            onClick={(event) => {
              event.stopPropagation();
              setEditMode('sketch');
              setSketchMode('pencil');
            }}
          >
            <FaPencil />
          </ToolbarItemButton>
        )}
        {/** 橡皮擦 2 */}
        {focusSpaceCardId && (
          <ToolbarItemButton
            isFocused={selectedId === 2}
            onClick={(event) => {
              event.stopPropagation();
              setEditMode('sketch');
              setSketchMode('eraser');
            }}
          >
            <FaEraser />
          </ToolbarItemButton>
        )}
        {/** 新增題目 3 */}
        {!focusSpaceCardId && (
          <ToolbarItemAddCardButton
            viewRef={viewRef}
            mutateCreateSpaceCard={mutateCreateSpaceCard}
            mutateCreateCard={mutateCreateCard}
            setSpace={setSpace}
            space={space}
            editorRef={editorRef}
          />
        )}
        {/** 刪除題目 3 */}
        {focusSpaceCardId && (
          <ToolbarItemDeleteCardButton
            mutateDeleteSpaceCard={mutateDeleteSpaceCard}
            focusSpaceCardId={focusSpaceCardId}
            setSpace={setSpace}
            space={space}
          />
        )}
      </div>

      {/** 第二層 */}
      <div
        className="absolute right-16 top-1/2 z-50 flex h-fit w-fit -translate-y-1/2 flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {editMode === 'sketch' && sketchMode === 'pencil' && (
          <SpaceToolbarLayerPencil
            pencilInfo={pencilInfo}
            setPencilInfo={setPencilInfo}
          />
        )}
        {editMode === 'sketch' && sketchMode === 'eraser' && (
          <SpaceToolbarLayerEraser
            eraserInfo={eraserInfo}
            setEraserInfo={setEraserInfo}
          />
        )}
      </div>
    </>
  );
}

export default SpaceToolbar;
