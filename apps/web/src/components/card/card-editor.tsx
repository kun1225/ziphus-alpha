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
import useCanvasEditor from '@/hooks/useCanvasEditor';
import useCardResize from '@/hooks/card/useCardResize';
import useUpdateCardIsSizeFitContent from '@/hooks/card/useUpdateCardIsSizeFitContent';

export const MIN_CARD_HEIGHT = 300;
export const MIN_CARD_WIDTH = 300;

interface IndependentCardEditor {
  initialCard: CardGetByIdResponseDTO['card'];
  cardId: string;
}

export function IndependentCardEditor(props: IndependentCardEditor) {
  const { editMode, sketchMode, pencilInfo, eraserInfo } = useCanvasEditor();

  return (
    <CardEditorSEO
      {...props}
      isFocus={true}
      isEditable={true}
      editMode={editMode}
      sketchMode={sketchMode}
      pencilInfo={pencilInfo}
      eraserInfo={eraserInfo}
    />
  );
}

interface CardEditorProps {
  initialCard: CardGetByIdResponseDTO['card'];
  cardId: string;
  isFocus: boolean;
  isEditable: boolean;
  editMode: EditMode;
  sketchMode: SketchMode;
  pencilInfo: PencilInfo;
  eraserInfo: EraserInfo;
}

export function CardEditorSEO(props: CardEditorProps) {
  const { initialCard, cardId } = props;
  const { card: fetchedCard, isLoading, error } = useQueryCardById(cardId);

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
}: CardEditorProps) {
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
  const mutateUpdateCardIsSizeFitContent = useUpdateCardIsSizeFitContent(
    initialCard.id,
    (isSizeFitContent) => {
      cardDataRef.current.isSizeFitContent = isSizeFitContent;
    },
  );

  const onContentSizeChange = useCallback((height: number) => {
    if (!cardDataRef.current.isSizeFitContent) {
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
      if (cardDataRef.current.isSizeFitContent) {
        mutateUpdateCardIsSizeFitContent.mutate({
          isSizeFitContent: false,
        });
      }
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
    useCardResize(
      isFocus,
      cardDataRef,
      onCardSizeChange,
      onCardSizeChangeFinish,
    );

  if (!account || status !== 'connected' || !provider) return null;

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
