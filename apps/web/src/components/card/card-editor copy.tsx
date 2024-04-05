'use client';
import useMe from '@/hooks/useMe';
import CardEditorMarkdownEditor from './card-editor-markdown-editor';
import useYJSProvide from '@/hooks/useYJSProvider';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CardDto, CardGetByIdResponseDTO } from '@repo/shared-types';
import useUpdateCardSize from '@/hooks/card/useUpdateCardSize';
import CardEditorSketchPanel, {
  EditMode,
  EraserInfo,
  PencilInfo,
  SketchMode,
} from './card-editor-sketch-panel';
import useQueryCardById from '@/hooks/card/useQueryCardById';

const MIN_CARD_HEIGHT = 300;
const MIN_CARD_WIDTH = 300;

interface CardEditorSEOProps {
  initialCard: CardGetByIdResponseDTO['card'];
  cardId: string;
  isFocus: boolean;
  isEditable: boolean;
  editMode: EditMode;
  sketchMode: SketchMode;
  pencilInfo: PencilInfo;
  eraserInfo: EraserInfo;
}

export function CardEditorSEO(props: CardEditorSEOProps) {
  const { initialCard, cardId } = props;
  const { card: fetchedCard } = useQueryCardById(cardId);

  if (!initialCard && !fetchedCard) return <div>Loading...</div>;

  if (initialCard && !fetchedCard)
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: initialCard.content as string,
        }}
      ></div>
    );
  

  return <CardEditor {...props} initialCard={initialCard || fetchedCard} />;
}

// 拉動卡片邊框
type ResizeBorderType = 'width' | 'height' | 'all';
const useResize = (
  available: boolean,
  cardRef: React.MutableRefObject<CardDto | undefined>,
  onResizeMove: (width: number, height: number) => void,
  onResizeFinish: (width: number, height: number) => void,
) => {
  const initialCard = useRef(cardRef.current);
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
    if (!available || !widthBorderHandle || !heightBorderHandle) return;

    const getResize = (event: MouseEvent | TouchEvent) => {
      const clientX =
        ('clientX' in event ? event.clientX : event.touches[0]?.clientX) ?? 0;
      const clientY =
        ('clientY' in event ? event.clientY : event.touches[0]?.clientY) ?? 0;

      const deltaWidth = clientX - initialPosition.current.x;
      const deltaHeight = clientY - initialPosition.current.y;
      const width = Math.max(
        MIN_CARD_WIDTH,
        initialCard.current!.width + deltaWidth,
      );
      const height = Math.max(
        MIN_CARD_HEIGHT,
        initialCard.current!.height + deltaHeight,
      );
      return {
        width,
        height,
      };
    };

    const handleResizeMove =
      (type: ResizeBorderType) => (event: MouseEvent | TouchEvent) => {
        const { width, height } = getResize(event);
        onResizeMove(
          type === 'height' ? initialCard.current!.width : width,
          type === 'width' ? initialCard.current!.height : height,
        );
      };

    const handleResizeFinish =
      (type: ResizeBorderType) => (event: MouseEvent | TouchEvent) => {
        const { width, height } = getResize(event);
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

    const handlePointUp = (type: ResizeBorderType) => () => {
      document.removeEventListener('mousemove', handleResizeMoveMap[type]);
      document.removeEventListener('mouseup', handleResizeFinishMap[type]);
      document.removeEventListener('mouseup', handlePointUpMap[type]);
      document.removeEventListener('touchmove', handleResizeMoveMap[type]);
      document.removeEventListener('touchend', handleResizeFinishMap[type]);
      document.removeEventListener('touchend', handlePointUpMap[type]);
    };

    const handlePointUpMap = {
      width: handlePointUp('width'),
      height: handlePointUp('height'),
      all: handlePointUp('all'),
    };

    const handlePointDown =
      (type: ResizeBorderType) => (event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        document.addEventListener('mousemove', handleResizeMoveMap[type]);
        document.addEventListener('mouseup', handleResizeFinishMap[type]);
        document.addEventListener('mouseup', handlePointUpMap[type]);
        document.addEventListener('touchmove', handleResizeMoveMap[type]);
        document.addEventListener('touchend', handleResizeFinishMap[type]);
        document.addEventListener('touchend', handlePointUpMap[type]);
        initialCard.current = {
          ...cardRef.current,
        } as CardDto;
        const clientX =
          ('clientX' in event ? event.clientX : event.touches[0]?.clientX) ?? 0;
        const clientY =
          ('clientY' in event ? event.clientY : event.touches[0]?.clientY) ?? 0;
        initialPosition.current = {
          x: clientX,
          y: clientY,
        };
      };

    const handlePointDownMap = {
      width: handlePointDown('width'),
      height: handlePointDown('height'),
      all: handlePointDown('all'),
    };

    widthBorderHandle.addEventListener('mousedown', handlePointDownMap.width);
    heightBorderHandle.addEventListener('mousedown', handlePointDownMap.height);
    cornerBorderHandleRef.current?.addEventListener(
      'mousedown',
      handlePointDownMap.all,
    );
    widthBorderHandle.addEventListener('touchstart', handlePointDownMap.width);
    heightBorderHandle.addEventListener(
      'touchstart',
      handlePointDownMap.height,
    );
    cornerBorderHandleRef.current?.addEventListener(
      'touchstart',
      handlePointDownMap.all,
    );

    return () => {
      widthBorderHandle.removeEventListener(
        'mousedown',
        handlePointDownMap.width,
      );
      heightBorderHandle.removeEventListener(
        'mousedown',
        handlePointDownMap.height,
      );
      cornerBorderHandleRef.current?.removeEventListener(
        'mousedown',
        handlePointDownMap.all,
      );
      widthBorderHandle.removeEventListener(
        'touchstart',
        handlePointDownMap.width,
      );
      heightBorderHandle.removeEventListener(
        'touchstart',
        handlePointDownMap.height,
      );
      cornerBorderHandleRef.current?.removeEventListener(
        'touchstart',
        handlePointDownMap.all,
      );
    };
  }, [available, onResizeMove, onResizeFinish]);

  return {
    widthBorderHandleRef,
    heightBorderHandleRef,
    cornerBorderHandleRef,
  };
};

// 隨時更新位置
const useViewScaleUpdate = (
  cardHTMLElementRef: React.RefObject<HTMLDivElement>,
  cardDataRef: React.MutableRefObject<CardDto>,
) => {
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!cardHTMLElementRef.current) {
      return;
    }
    cardHTMLElementRef.current.style.width = `${cardDataRef.current.width}px`;
    cardHTMLElementRef.current.style.height = `${cardDataRef.current.height}px`;
  }, [refresh]);

  const needRefresh = useCallback(() => {
    setRefresh((prev) => prev + 1);
  }, []);

  return {
    needRefresh,
  };
};

function CardEditor({
  initialCard,
  isFocus,
  isEditable,
  editMode,
  sketchMode,
  pencilInfo,
  eraserInfo,
}: CardEditorSEOProps) {
  if (!initialCard) throw new Error('Card not found');

  const cardDataRef = useRef<CardDto>(initialCard);
  const cardHTMLElementRef = useRef<HTMLDivElement>(null);
  const { account } = useMe();
  const { doc, provider, status } = useYJSProvide(`card:${initialCard?.id}`);

  const { needRefresh } = useViewScaleUpdate(cardHTMLElementRef, cardDataRef);

  const mutateUpdateCardSize = useUpdateCardSize(
    initialCard.id,
    (width, height) => {
      cardDataRef.current.width = width;
      cardDataRef.current.height = height;
      needRefresh();
    },
  );

  const onContentSizeChange = useCallback((height: number) => {
    // TODO
    if (false) {
      return;
    }

    mutateUpdateCardSize.mutate({
      height: height < MIN_CARD_HEIGHT ? MIN_CARD_HEIGHT : height,
      width: cardDataRef.current.width,
    });
  }, []);

  const onCardSizeChange = useCallback(
    (width: number, height: number) => {
      cardDataRef.current.width = width;
      cardDataRef.current.height = height;
      needRefresh();
    },
    [needRefresh],
  );

  const onCardSizeChangeFinish = useCallback(
    (width: number, height: number) => {
      mutateUpdateCardSize.mutate({
        width,
        height,
      });
    },
    [mutateUpdateCardSize],
  );

  const { widthBorderHandleRef, heightBorderHandleRef, cornerBorderHandleRef } =
    useResize(isFocus, cardDataRef, onCardSizeChange, onCardSizeChangeFinish);

  if (!account || status !== 'connected') return null;

  return (
    <div className="relative overflow-hidden" ref={cardHTMLElementRef}>
      <CardEditorSketchPanel
        isSketching={editMode === 'sketch'}
        cardId={cardDataRef.current.id}
        accountName={account.name}
        doc={doc}
        sketchMode={sketchMode}
        pencilInfo={pencilInfo}
        eraserInfo={eraserInfo}
      />
      <CardEditorMarkdownEditor
        cardId={cardDataRef.current.id}
        onContentSizeChange={onContentSizeChange}
        accountName={account.name}
        provider={provider}
        doc={doc}
      />
      {isFocus && (
        <>
          <div
            ref={widthBorderHandleRef}
            className="absolute right-0 top-0 h-[calc(100%-0.5rem)] w-2 cursor-ew-resize"
          />
          <div
            ref={heightBorderHandleRef}
            className="absolute bottom-0 left-0 h-2 w-[calc(100%-0.5rem)] cursor-ns-resize"
          />
          <div
            ref={cornerBorderHandleRef}
            className="absolute bottom-0 right-0 h-2 w-2 cursor-nwse-resize"
          />
        </>
      )}
    </div>
  );
}

export default CardEditor;
