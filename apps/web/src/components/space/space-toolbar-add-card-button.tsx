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

export default function ToolbarItemAddCardButton(
  {
    mutateCreateSpaceCard,
    mutateCreateCard,
    space,
    setSpace,
    viewRef,
    editorRef,
  }: ToolbarItemAddCardButtonProps,
) {
  const ref = useRef<HTMLButtonElement>(null);

  useDraggable(
    {
      draggableItemRef: ref,
      containerRef: editorRef,
      onDragEnd({ x, y }) {
        mutateCreateCard.mutate(undefined, {
          onSuccess: (data) => {
            console.log('新增卡片成功', data.data);
            const view = viewRef.current;
            mutateCreateSpaceCard.mutate(
              {
                spaceId: space!.id,
                targetCardId: data.data.card.id,
                ...transformMouseClientPositionToViewPosition(
                  view,
                  x,
                  y,
                ),
              },
              {
                onSuccess: (data: any) => {
                  console.log('新增卡片成功', data.data);
                  setSpace({
                    ...space!,
                    spaceCards: [
                      ...space!.spaceCards,
                      data.data.spaceCard,
                    ],
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
    },
  );


  return (
    <ToolbarItemButton
      ref={ref}
      isFocused={false}
    >
      <MdLibraryAdd />
    </ToolbarItemButton>
  );
}