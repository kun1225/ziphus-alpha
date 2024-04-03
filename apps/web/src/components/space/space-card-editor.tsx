'use client';
import useCardEditor from '@/hooks/card/useCardEditor';
import useUpdateSpaceCardPosition from '@/hooks/space/useUpdateSpaceCardPosition';
import useMe from '@/hooks/useMe';
import { CardGetByIdResponseDTO, SpaceCardDTO } from '@repo/shared-types';
import { View } from '@/models/view';
import { useCallback, useEffect, useRef } from 'react';
import CardEditorSketchPanel, {
  EditMode,
  EraserInfo,
  PencilInfo,
  SketchMode,
} from '../card/card-editor-sketch-panel';
import CardEditorMarkdownEditor from '../card/card-editor-markdown-editor';
import { cn } from '@/utils/cn';
import useUpdateCardSize from '@/hooks/card/useUpdateCardSize';
import useDraggable from '@/hooks/useDraggable';
import useYJSProvide from '@/hooks/useYJSProvider';

const MIN_CARD_HEIGHT = 300;
const MIN_CARD_WIDTH = 300;

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

type ResizeBorderType = 'width' | 'height' | 'all'
// 拉動卡片邊框
const useResize = (
  available: boolean,
  card: CardGetByIdResponseDTO['card'],
  onResizeMove: (width: number, height: number) => void,
  onResizeFinish: (width: number, height: number) => void,
) => {
  const initialCard = useRef(card);
  const initialPosition = useRef({
    x: 0,
    y: 0,
  });
  const widthBorderHandleRef = useRef<HTMLDivElement>(null);
  const heightBorderHandleRef = useRef<HTMLDivElement>(null);
  const cornerBorderHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const widthBorderHandle = widthBorderHandleRef.current;
    const heightBorderHandle = heightBorderHandleRef.current;
    if (!available || !widthBorderHandle || !heightBorderHandle || !card) return;

    const getResize = (event: MouseEvent) => {
      const deltaWidth = event.clientX - initialPosition.current.x;
      const deltaHeight = event.clientY - initialPosition.current.y;
      const width = Math.max(MIN_CARD_WIDTH, initialCard.current!.width + deltaWidth);
      const height = Math.max(MIN_CARD_HEIGHT, initialCard.current!.height + deltaHeight);
      return {
        width,
        height,
      };
    };

    const handleResizeMove = (type: ResizeBorderType) => (event: MouseEvent) => {
      const {
        width,
        height,
      } = getResize(event);
      onResizeMove(
        type === 'height' ? initialCard.current!.width : width,
        type === 'width' ? initialCard.current!.height : height,
      );
    };

    const handleResizeFinish = (type: ResizeBorderType) => (event: MouseEvent) => {
      const {
        width,
        height,
      } = getResize(event);
      onResizeFinish(
        type === 'height' ? initialCard.current!.width : width,
        type === 'width' ? initialCard.current!.height : height,
      );
    };

    const handleResizeMoveMap = {
      width: handleResizeMove('width'),
      height: handleResizeMove('height'),
      all: handleResizeMove('all'),
    };

    const handleResizeFinishMap = {
      width: handleResizeFinish('width'),
      height: handleResizeFinish('height'),
      all: handleResizeFinish('all'),
    };

    const handleMouseUp = (type: ResizeBorderType) => () => {
      document.removeEventListener('mousemove', handleResizeMoveMap[type]);
      document.removeEventListener('mouseup', handleResizeFinishMap[type]);
      document.removeEventListener('mouseup', handleMouseUpMap[type]);
    };

    const handleMouseUpMap = {
      width: handleMouseUp('width'),
      height: handleMouseUp('height'),
      all: handleMouseUp('all'),
    };

    const handleMouseDown = (type: ResizeBorderType) => (event: MouseEvent) => {
      event.preventDefault();
      document.addEventListener('mousemove', handleResizeMoveMap[type]);
      document.addEventListener('mouseup', handleResizeFinishMap[type]);
      document.addEventListener('mouseup', handleMouseUpMap[type]);
      initialCard.current = card;
      initialPosition.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handleMouseDownMap = {
      width: handleMouseDown('width'),
      height: handleMouseDown('height'),
      all: handleMouseDown('all'),
    };

    widthBorderHandle.addEventListener('mousedown', handleMouseDownMap.width);
    heightBorderHandle.addEventListener('mousedown', handleMouseDownMap.height);
    cornerBorderHandleRef.current?.addEventListener('mousedown', handleMouseDownMap.all);

    return () => {
      widthBorderHandle.removeEventListener('mousedown', handleMouseDownMap.width);
      heightBorderHandle.removeEventListener('mousedown', handleMouseDownMap.height);
      cornerBorderHandleRef.current?.removeEventListener('mousedown', handleMouseDownMap.all);
    };
  }, [available, card?.width, card?.height, onResizeMove, onResizeFinish]);

  return {
    widthBorderHandleRef,
    heightBorderHandleRef,
    cornerBorderHandleRef,
  };
};

interface SpaceCardEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  initialSpaceCard: SpaceCardDTO;
  isFocus: boolean;
  viewRef: React.MutableRefObject<View>;
  editMode: EditMode;
  sketchMode: SketchMode;
  pencilInfo: PencilInfo;
  eraserInfo: EraserInfo;
}

function SpaceCardEditor({
  initialSpaceCard,
  isFocus,
  viewRef,
  editMode,
  sketchMode,
  pencilInfo,
  eraserInfo,
  ...props
}: SpaceCardEditorProps) {
  const { account } = useMe();
  const { doc, provider, status } = useYJSProvide(
    `card:${initialSpaceCard.targetCardId}`,
  );
  const spaceCardElementRef = useRef<HTMLDivElement>(null);
  const spaceCardRef = useRef<SpaceCardDTO>(initialSpaceCard);
  const { card, setCard, isLoading, error } = useCardEditor(
    initialSpaceCard.targetCardId,
  );
  const mutateUpdateCardSize = useUpdateCardSize(card, setCard);
  useTransformUpdate(spaceCardElementRef, spaceCardRef);

  const { handleUpdatePosition } = useUpdateSpaceCardPosition(spaceCardRef);

  useDraggable({
    available: !isFocus,
    draggableItemRef: spaceCardElementRef,
    onDrag: ({ deltaX, deltaY }) => {
      spaceCardRef.current = {
        ...spaceCardRef.current,
        x: spaceCardRef.current.x + deltaX / viewRef.current.scale,
        y: spaceCardRef.current.y + deltaY / viewRef.current.scale,
      };
      handleUpdatePosition({
        spaceId: spaceCardRef.current.targetSpaceId,
        spaceCardId: spaceCardRef.current.id,
        x: spaceCardRef.current.x,
        y: spaceCardRef.current.y,
      });
    },
  });

  const onContentSizeChange = useCallback((height: number) => {
    if (!card) {
      return;
    }

    if (Math.abs(height - card.height) > 32) {
      return;
    }

    if (card.height !== height && height > MIN_CARD_HEIGHT) {
      mutateUpdateCardSize.mutate({
        height,
      });
    } else if (card.height > MIN_CARD_HEIGHT && height < MIN_CARD_HEIGHT) {
      mutateUpdateCardSize.mutate({
        height: MIN_CARD_HEIGHT,
      });
    }
  }, [card, setCard]);

  const onCardSizeChange = useCallback((width: number, height: number) => {
    if (!card) {
      return;
    }

    setCard({
      ...card,
      width: width || card.width,
      height: height || card.height,
    });
  }, [card, setCard]);

  const onCardResize = useCallback((width: number, height: number) => {
    if (!card) {
      return;
    }

    mutateUpdateCardSize.mutate({
      width,
      height,
    });
  }, [card, mutateUpdateCardSize]);

  const {
    widthBorderHandleRef,
    heightBorderHandleRef,
    cornerBorderHandleRef,
  } = useResize(isFocus, card, onCardSizeChange, onCardResize);

  return (
    <div
      className={cn(
        'space-card absolute h-fit w-fit rounded-lg  bg-gray-900 shadow-md',
        isFocus
          ? 'outline outline-4 outline-white '
          : 'cursor-pointer outline outline-1 outline-white ',
      )}
      {...props}
      ref={spaceCardElementRef}
      id={initialSpaceCard.id}
    >
      {card && account ? (
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
              onContentSizeChange={onContentSizeChange}
              accountName={account.name}
              provider={provider}
              doc={doc}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-lg text-white">
          Loading
        </div>
      )}
      {
        isFocus && (
          <>
            <div
              ref={widthBorderHandleRef}
              className="absolute top-0 right-0 w-2 h-[calc(100%-0.5rem)] cursor-ew-resize"
            />
            <div
              ref={heightBorderHandleRef}
              className="absolute bottom-0 left-0 w-[calc(100%-0.5rem)] h-2 cursor-ns-resize"
            />
            <div
              ref={cornerBorderHandleRef}
              className="absolute bottom-0 right-0 w-2 h-2 cursor-nwse-resize"
            />
          </>
        )
      }
    </div>
  );
}

export default SpaceCardEditor;
