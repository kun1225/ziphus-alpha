'use client';
import {
  EditMode,
  SketchMode,
  PencilInfo,
  EraserInfo,
} from '@/components/card/card-editor-sketch-panel';
import SpaceToolbarEraser from './space-toolbar-eraser';
import SpaceToolbarPencil from './space-toolbar-pencil';
import { cn } from '@/utils/cn';
import { FaEraser, FaPencil } from 'react-icons/fa6';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';

interface ToolbarItem {
  id: number;
  icon: JSX.Element;
  handler: () => void;
}


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

  const modes = [
    {
      id: 0,
      icon: <IoDocumentTextOutline />,
      handler: () => setEditMode('text'),
    },
    isCardFocused && {
      id: 1,
      icon: <FaPencil />,
      handler: () => {
        setEditMode('sketch');
        setSketchMode('pencil');
      },
    },
    isCardFocused && {
      id: 2,
      icon: <FaEraser />,
      handler: () => {
        setEditMode('sketch');
        setSketchMode('eraser');
      },
    },
  ].filter(Boolean) as ToolbarItem[];

  return (
    <>
      <div className="w-12 flex flex-col items-center absolute right-2 top-1/2 -translate-y-1/2 z-50">
        {
          modes.map((mode) => (
            <button
              key={mode.id}
              className={
                cn(
                  'w-12 h-12 rounded flex justify-center items-center cursor-pointer text-white',
                  selectedId === mode.id ? 'bg-gray-800' : 'bg-opacity-0',
                )
              }
              onClick={(event) => {
                event.stopPropagation();
                mode.handler();
              }}
            >
              {mode.icon}
            </button>
          ))
        }
      </div>
      {
        editMode === 'sketch' && sketchMode === 'pencil' && (
          <SpaceToolbarPencil
            pencilInfo={pencilInfo}
            setPencilInfo={setPencilInfo}
          />
        )
      }
      {
        editMode === 'sketch' && sketchMode === 'eraser' && (
          <SpaceToolbarEraser
            eraserInfo={eraserInfo}
            setEraserInfo={setEraserInfo}
          />
        )
      }
    </>
  );
}

export default SpaceToolbar;
