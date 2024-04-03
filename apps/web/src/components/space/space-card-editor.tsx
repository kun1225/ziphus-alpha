'use client';
import useCardEditor from '@/hooks/card/useCardEditor';
import useUpdateSpaceCardPosition from '@/hooks/space/useUpdateSpaceCardPosition';
import useMe from '@/hooks/useMe';
import { CardGetByIdResponseDTO, SpaceCardDTO } from '@repo/shared-types';
import { View } from '@/models/view';
import { useEffect, useRef } from 'react';
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

// 拉動卡片邊框
const useResize = (
  avaliable: boolean,
  card: CardGetByIdResponseDTO['card'],
  onChange: (width: number, height: number) => void,
  onResize: (width: number, height: number) => void,
) => {
  const initialCard = useRef(card);
  const initialPosition = useRef({
    x: 0,
    y: 0,
  });
  const widthBorderHandleRef = useRef<HTMLDivElement>(null);
  const heightBorderHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const widthBorderHandle = widthBorderHandleRef.current;
    const heightBorderHandle = heightBorderHandleRef.current;
    if (!avaliable || !widthBorderHandle || !heightBorderHandle || !card) return;

    const handleResizeChange = (event: MouseEvent) => {
      const deltaWidth = event.clientX - initialPosition.current.x;
      const deltaHeight = event.clientY - initialPosition.current.y;
      const width = Math.max(MIN_CARD_WIDTH, initialCard.current!.width + deltaWidth);
      const height = Math.max(MIN_CARD_HEIGHT, initialCard.current!.height + deltaHeight);
      onChange(
        width,
        height,
      );
    };

    const handleResize = (event: MouseEvent) => {
      const deltaWidth = event.clientX - initialPosition.current.x;
      const deltaHeight = event.clientY - initialPosition.current.y;
      const width = Math.max(MIN_CARD_WIDTH, initialCard.current!.width + deltaWidth);
      const height = Math.max(MIN_CARD_HEIGHT, initialCard.current!.height + deltaHeight);
      onResize(
        width,
        height,
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleResizeChange);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (event: MouseEvent) => {
      document.addEventListener('mousemove', handleResizeChange);
      document.addEventListener('mouseup', handleMouseUp);
      initialCard.current = card;
      initialPosition.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    widthBorderHandle.addEventListener('mousedown', handleMouseDown);
    heightBorderHandle.addEventListener('mousedown', handleMouseDown);

    return () => {
      widthBorderHandle.removeEventListener('mousedown', handleResize);
      heightBorderHandle.removeEventListener('mousedown', handleResize);
    };
  }, [avaliable, card?.width, card?.height, onResize]);

  return {
    widthBorderHandleRef,
    heightBorderHandleRef,
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

  const onCardSizeChagne = (width: number, height: number) => {
    if (!card) {
      return;
    }

    setCard({
      ...card,
      width: width || card.width,
      height: height || card.height,
    });
  };

  const onCardResize = (width: number, height: number) => {
    if (!card) {
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


    if (card.width !== width && width > MIN_CARD_WIDTH) {
      mutateUpdateCardSize.mutate({
        width,
      });
    } else if (card.height > MIN_CARD_WIDTH && height < MIN_CARD_WIDTH) {
      mutateUpdateCardSize.mutate({
        width: MIN_CARD_WIDTH,
      });
    }
  };

  const {
    widthBorderHandleRef,
    heightBorderHandleRef,
  } = useResize(isFocus, card, onCardSizeChagne, onCardResize);

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
              onCardSizeChange={onCardResize}
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
              className="absolute bottom-0 right-0 w-1 h-full bg-white cursor-ew-resize"
            />
            <div
              ref={heightBorderHandleRef}
              className="absolute bottom-0 right-0 w-full h-1 bg-white cursor-ns-resize"
            />
          </>
        )
      }
    </div>
  );
}

export default SpaceCardEditor;
