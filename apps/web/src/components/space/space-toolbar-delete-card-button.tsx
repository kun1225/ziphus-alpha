'use client';
import ToolbarItemButton from './space-toolbar-item-button';
import { SpaceGetByIdResponseDTO } from '@repo/shared-types';
import { View } from '@/models/view';
import { IoTrashBinOutline } from 'react-icons/io5';
import useDeleteSpaceCard from '@/hooks/space/useDeleteSpaceCard';
import { useState } from 'react';
import { toast } from 'sonner';

interface ToolbarItemDeleteCardButtonProps {
  focusSpaceCardId: string | null;
  mutateDeleteSpaceCard: ReturnType<typeof useDeleteSpaceCard>;
  space: SpaceGetByIdResponseDTO['space'];
  setSpace: (space: SpaceGetByIdResponseDTO['space']) => void;
}

export default function ToolbarItemDeleteCardButton({
  focusSpaceCardId,
  mutateDeleteSpaceCard,
  setSpace,
  space,
}: ToolbarItemDeleteCardButtonProps) {
  const [tryDeleteCard, setTryDeleteCard] = useState(false);
  return (
    <>
      <div className=" relative">
        <ToolbarItemButton className='bg-red-700' isFocused={true}
          onClick={(event) => {
            event.stopPropagation();
            if (!tryDeleteCard) {
              setTryDeleteCard(true);
            } else {
              mutateDeleteSpaceCard.mutate({
                spaceId: space?.id!,
                spaceCardId: focusSpaceCardId!,
              });
              setSpace({
                ...space!,
                spaceCards: space!.spaceCards.filter(
                  (spaceCard) => spaceCard.id !== focusSpaceCardId!,
                ),
              });
            }
          }}
        >
          <IoTrashBinOutline />
        </ToolbarItemButton>
        {tryDeleteCard && (
          <div className=" pointer-events-none bg-red-700 absolute right-14 top-0 h-fit w-64 rounded text-white px-2 py-1 text-white">
            <p>再點一次以確定刪除該卡片</p>
          </div>
        )}
      </div>
    </>
  );
}
