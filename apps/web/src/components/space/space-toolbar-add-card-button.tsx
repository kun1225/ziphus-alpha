'use client';
import { cn } from '@/utils/cn';
import ToolbarItemButton from './space-toolbar-item-button';
import { useCallback, useRef, useState } from 'react';
import useCreateSpaceCard from '@/hooks/space/useCreateSpaceCard';
import useCreateCard from '@/hooks/card/useCreateCard';
import { SpaceGetByIdResponseDTO } from '@repo/shared-types';
import { View } from '@/models/view';
import transformMouseClientPositionToViewPosition from '@/utils/space/transformMouseClientPositionToViewPosition';
import { MdLibraryAdd } from 'react-icons/md';
import useDraggable from '@/hooks/useDraggable';

interface ToolbarItemAddCardButtonProps {
  mutateCreateSpaceCard: ReturnType<typeof useCreateSpaceCard>;
  mutateCreateCard: ReturnType<typeof useCreateCard>;
  space: SpaceGetByIdResponseDTO['space'];
  setSpace: (space: SpaceGetByIdResponseDTO['space']) => void;
  viewRef: React.MutableRefObject<View>;
  editorRef: React.RefObject<HTMLDivElement>;
}

export default function ToolbarItemAddCardButton({
  mutateCreateSpaceCard,
  mutateCreateCard,
  space,
  setSpace,
  viewRef,
  editorRef,
}: ToolbarItemAddCardButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const draggingShadowRef = useRef<HTMLDivElement>(null);
  const [draggingStartPosition, setDraggingStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [availableAddCard, setAvailableAddCard] = useState(false);

  useDraggable({
    draggableItemRef: ref,
    containerRef: editorRef,
    onDragStart({ x, y }) {
      setDraggingStartPosition({ x, y });
      setAvailableAddCard(false);
    },
    onDragEnd({ x, y }) {
      if (!draggingStartPosition) return;
      setDraggingStartPosition(null);
      if (
        Math.abs(x - draggingStartPosition.x) < 32 &&
        Math.abs(y - draggingStartPosition.y) < 32
      ) {
        return;
      }
      mutateCreateCard.mutate(undefined, {
        onSuccess: (data) => {
          console.log('新增卡片成功', data.data);
          const view = viewRef.current;
          mutateCreateSpaceCard.mutate(
            {
              spaceId: space!.id,
              targetCardId: data.data.card.id,
              ...transformMouseClientPositionToViewPosition(view, x, y),
            },
            {
              onSuccess: (data: any) => {
                console.log('新增卡片成功', data.data);
                setSpace({
                  ...space!,
                  spaceCards: [...space!.spaceCards, data.data.spaceCard],
                });
              },
            },
          );
        },
        onError: (error) => {
          console.error('新增卡片失敗', error);
        },
      });
    },
    onDrag({ x, y }) {
      if (!draggingStartPosition) return;
      draggingShadowRef.current!.style.transform = `translate(${x - draggingStartPosition.x}px, ${y - draggingStartPosition.y}px)`;
      if (
        Math.abs(x - draggingStartPosition.x) < 32 &&
        Math.abs(y - draggingStartPosition.y) < 32
      ) {
        draggingShadowRef.current!.style.opacity = '0.2';
        setAvailableAddCard(false);
        return;
      }
      draggingShadowRef.current!.style.opacity = '0.8';
      setAvailableAddCard(true);
    },
  });

  return (
    <>
      <div className=" relative">
        <ToolbarItemButton ref={ref} isFocused={false}>
          <MdLibraryAdd />
        </ToolbarItemButton>
        <div
          ref={draggingShadowRef}
          className={cn(
            'absolute left-0 top-0 h-0 w-0 rounded bg-gray-800 flex justify-center items-center text-white',
            draggingStartPosition ? 'h-12 w-12' : 'hidden h-0 w-0',
          )}
        >
          <MdLibraryAdd />
        </div>
        {draggingStartPosition && (
          <div className=" pointer-events-none absolute right-14 top-0 h-fit w-36 bg-gray-700 rounded text-white px-2 py-1 text-white">
            {availableAddCard ? (
              <p>放開新增卡片</p>
            ) : (
              <p className=" text-gray-400">繼續拖曳新增卡片</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
