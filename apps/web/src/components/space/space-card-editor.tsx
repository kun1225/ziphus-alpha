"use client";
import useCardEditor from "@/hooks/card/useCardEditor";
import useUpdateSpaceCardPosition from "@/hooks/space/useUpdateSpaceCardPosition";
import useMe from "@/hooks/useMe";
import { SpaceCardDTO } from "@repo/shared-types";
import { View } from "@/models/view";
import { useEffect, useRef } from "react";
import CardEditorSketchPanel, {
  EditMode,
  EraserInfo,
  PencilInfo,
  SketchMode,
} from "../card/card-editor-sketch-panel";
import CardEditorMarkdownEditor from "../card/card-editor-markdown-editor";
import { cn } from "@/utils/cn";
import useUpdateCardSize from "@/hooks/card/useUpdateCardSize";
import useDraggable from "@/hooks/useDraggable";
import useYJSProvide from "@/hooks/useYJSProvider";

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

  return (
    <div
      className={cn(
        "space-card absolute h-fit w-fit rounded-lg  bg-gray-900 shadow-md",
        isFocus
          ? "outline outline-4 outline-white "
          : "cursor-pointer outline outline-1 outline-white ",
      )}
      {...props}
      ref={spaceCardElementRef}
      id={initialSpaceCard.id}
    >
      {card && account ? (
        <div
          className={cn(
            "flex flex-col gap-2",
            isFocus ? "pointer-events-auto" : "pointer-events-none",
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
              isSketching={editMode === "sketch"}
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
    </div>
  );
}

export default SpaceCardEditor;
