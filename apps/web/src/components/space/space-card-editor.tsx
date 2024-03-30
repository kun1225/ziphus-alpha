'use client';
import useCardEditor from '@/hooks/card/useCardEditor';
import useUpdateSpaceCardPosition from '@/hooks/space/useUpdateSpaceCardPosition';
import useMe from '@/hooks/useMe';
import { SpaceCardDTO } from '@repo/shared-types';
import { View } from './space-editor';
import { useEffect, useRef, useState } from 'react';
import CardEditorSketchPanel, { EditMode, EraserInfo, PencilInfo, SketchMode } from '../card/card-editor-sketch-panel';
import CardEditorMarkdownEditor from '../card/card-editor-markdown-editor';
import CardEditorHeadToolbar from '../card/card-editor-head-toolbar';
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';
import { cn } from '@/utils/cn';
import useUpdateCardSize from '@/hooks/card/useUpdateCardSize';

// 隨時更新位置
const useTransformUpdate = (
  spaceCardElementRef: React.RefObject<HTMLDivElement>,
  spaceCardRef: React.MutableRefObject<SpaceCardDTO>,
) => {
  const lastPositionRef = useRef<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  useEffect(() => {
    let animationFrameId = 0;
    function handleViewChange() {
      animationFrameId = requestAnimationFrame(handleViewChange);
      const spaceCardElement = spaceCardElementRef.current;
      if (!spaceCardElement) return;
      if (
        lastPositionRef.current.x === spaceCardRef.current.x &&
        lastPositionRef.current.y === spaceCardRef.current.y
      ) {
        return;
      }

      spaceCardElement.style.transform = `translate(${spaceCardRef.current.x}px, ${spaceCardRef.current.y}px)`;
      lastPositionRef.current = { ...spaceCardRef.current };
    }
    handleViewChange();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
};

// 左鍵按住拖曳單張卡片
const useSpaceCardDrag = (
  isFocus: Boolean,
  spaceCardElementRef: React.RefObject<HTMLDivElement>,
  spaceCardRef: React.MutableRefObject<SpaceCardDTO>,
  viewRef: React.MutableRefObject<View>,
) => {
  const {
    handleUpdatePosition,
  } = useUpdateSpaceCardPosition(spaceCardRef);

  const lastClientXRef = useRef(0);
  const lastClientYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    spaceCardId: string,
  ) => {
    event.dataTransfer.setData('text/plain', '');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setDragImage(new Image(), 0, 0);
    if (isFocus) {
      return;
    }
    lastClientXRef.current = event.clientX;
    lastClientYRef.current = event.clientY;
    isDraggingRef.current = true;
  };

  const handleDrag = (
    event: React.DragEvent<HTMLDivElement>,
    spaceCardId: string,
  ) => {
    if (
      isFocus ||
      (event.clientX === 0 && event.clientY === 0) ||
      !isDraggingRef.current
    ) {
      return;
    }
    event.preventDefault();
    const deltaX = event.clientX - lastClientXRef.current;
    const deltaY = event.clientY - lastClientYRef.current;

    spaceCardRef.current = {
      ...spaceCardRef.current,
      x: spaceCardRef.current.x + deltaX / viewRef.current.scale,
      y: spaceCardRef.current.y + deltaY / viewRef.current.scale,
    };

    lastClientXRef.current = event.clientX;
    lastClientYRef.current = event.clientY;
    handleUpdatePosition({
      spaceId: spaceCardRef.current.targetSpaceId,
      spaceCardId,
      x: spaceCardRef.current.x,
      y: spaceCardRef.current.y,
    });
  };

  const handleDragEnd = (
    event: React.DragEvent<HTMLDivElement>,
    spaceCardId: string,
  ) => {
    if (isFocus) {
      return;
    }
    isDraggingRef.current = false;
  };

  return {
    handleDragStart,
    handleDrag,
    handleDragEnd,
  };
};

interface SpaceCardEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  initialSpaceCard: SpaceCardDTO;
  doc: Y.Doc;
  socketIOProvider: SocketIOProvider;
  isFocus: boolean;
  viewRef: React.MutableRefObject<View>;
  editMode: EditMode;
  sketchMode: SketchMode;
  pencilInfo: PencilInfo;
  eraserInfo: EraserInfo;
}

function SpaceCardEditor({
  initialSpaceCard,
  doc,
  socketIOProvider,
  isFocus,
  viewRef,
  editMode,
  sketchMode,
  pencilInfo,
  eraserInfo,
  ...props
}: SpaceCardEditorProps) {
  const { account } = useMe();
  const spaceCardElementRef = useRef<HTMLDivElement>(null);
  const spaceCardRef = useRef<SpaceCardDTO>(initialSpaceCard);
  const {
    card,
    setCard,
    isLoading,
    error,
  } = useCardEditor(initialSpaceCard.targetCardId);
  const mutateUpdateCardSize = useUpdateCardSize(card, setCard);
  useTransformUpdate(spaceCardElementRef, spaceCardRef);
  const { handleDragStart, handleDrag, handleDragEnd } = useSpaceCardDrag(
    isFocus,
    spaceCardElementRef,
    spaceCardRef,
    viewRef,
  );


  if (!card || !account) return null;

  return (
    <div
      className={cn(
        'space-card absolute h-fit w-fit rounded-lg  bg-gray-900 shadow-md',
        isFocus ? 'outline outline-4 outline-white ' : 'cursor-pointer outline outline-1 outline-white ',
      )}
      {...props}
      ref={spaceCardElementRef}
      draggable
      onDragStart={(event) => handleDragStart(event, initialSpaceCard.id)}
      onDrag={(event) => handleDrag(event, initialSpaceCard.id)}
      onDragEnd={(event) => handleDragEnd(event, initialSpaceCard.id)}
      id={initialSpaceCard.id}
    >
      <div
        className={cn(
          'flex flex-col gap-2',
          isFocus ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <div
          className="relative overflow-hidden"
          style={{
            width: card.width,
            height: card.height,
          }}
        >
          <CardEditorSketchPanel
            isSketching={editMode === 'sketch'}
            cardId={card.id as string}
            accountName={account.name}
            doc={doc}
            sketchMode={sketchMode}
            pencilInfo={pencilInfo}
            eraserInfo={eraserInfo}
          />
          <CardEditorMarkdownEditor
            cardId={card.id as string}
            onCardSizeChange={(width, height) => {
              if (card.height !== height && height > 1280) {
                mutateUpdateCardSize.mutate({
                  height,
                });
              } else if (card.height > 1280 && height < 1280) {
                mutateUpdateCardSize.mutate({
                  height: 1280,
                });
              }
            }}
            accountName={account.name}
            provider={socketIOProvider}
            doc={doc}
          />
        </div>
      </div>
    </div>
  );
}

export default SpaceCardEditor;
