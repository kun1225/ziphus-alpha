'use client';
import useUpdateSpaceCardPosition from '@/hooks/space/useUpdateSpaceCardPosition';
import { SpaceCardDTO } from '@repo/shared-types';
import { View } from '@/models/view';
import { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import useDraggable from '@/hooks/useDraggable';

// 隨時更新位置
const useTransformUpdate = (
  spaceCardHTMLElementRef: React.RefObject<HTMLDivElement>,
  spaceCardDataRef: React.MutableRefObject<SpaceCardDTO>,
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
      const spaceCardElement = spaceCardHTMLElementRef.current;
      if (!spaceCardElement) return;
      if (
        lastPositionRef.current.x === spaceCardDataRef.current.x &&
        lastPositionRef.current.y === spaceCardDataRef.current.y
      ) {
        return;
      }

      spaceCardElement.style.transform = `translate(${spaceCardDataRef.current.x}px, ${spaceCardDataRef.current.y}px)`;
      lastPositionRef.current = { ...spaceCardDataRef.current };
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
}

function SpaceCardEditor({
  initialSpaceCard,
  isFocus,
  viewRef,
  children,
  ...props
}: SpaceCardEditorProps) {
  const spaceCardHTMLElementRef = useRef<HTMLDivElement>(null);
  const spaceCardDataRef = useRef<SpaceCardDTO>(initialSpaceCard);

  useTransformUpdate(spaceCardHTMLElementRef, spaceCardDataRef);

  const { handleUpdatePosition } = useUpdateSpaceCardPosition(spaceCardDataRef);

  useDraggable({
    available: !isFocus,
    draggableItemRef: spaceCardHTMLElementRef,
    onDrag: ({ deltaX, deltaY }) => {
      spaceCardDataRef.current = {
        ...spaceCardDataRef.current,
        x: spaceCardDataRef.current.x + deltaX / viewRef.current.scale,
        y: spaceCardDataRef.current.y + deltaY / viewRef.current.scale,
      };
      handleUpdatePosition({
        spaceId: spaceCardDataRef.current.targetSpaceId,
        spaceCardId: spaceCardDataRef.current.id,
        x: spaceCardDataRef.current.x,
        y: spaceCardDataRef.current.y,
      });
    },
  });

  return (
    <div
      className={cn(
        'space-card absolute h-fit w-fit rounded-lg  bg-gray-900 shadow-md',
        isFocus
          ? 'outline outline-4 outline-white '
          : 'cursor-pointer outline outline-1 outline-white ',
      )}
      {...props}
      ref={spaceCardHTMLElementRef}
      id={initialSpaceCard.id}
    >
      {children}
    </div>
  );
}

export default SpaceCardEditor;
