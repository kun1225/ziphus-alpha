'use client';
import React from 'react';
import useCreateSpaceCard from '@/hooks/space/useCreateSpaceCard';
import useQueryCardList from '@/hooks/card/useQueryCardList';
import useCreateCard from '@/hooks/card/useCreateCard';
import useDeleteSpaceCard from '@/hooks/space/useDeleteSpaceCard';
import { SpaceDto } from '@repo/shared-types';
import { View } from '@/models/view';
import transformMouseClientPositionToViewPosition from '@/utils/space/transformMouseClientPositionToViewPosition';

export interface ContextMenuInfo {
  x: number;
  y: number;
  targetSpaceCardId?: string;
}

interface ContextMenuComponentProps {
  contextMenuInfo: ContextMenuInfo | null;
  setContextMenuInfo: (contextMenuInfo: ContextMenuInfo | null) => void;
  viewRef: React.MutableRefObject<View>;
  spaceId: string;
  space: SpaceDto;
  setSpace: (space: SpaceDto) => void;
  mutateDeleteSpaceCard: ReturnType<typeof useDeleteSpaceCard>;
  mutateCreateSpaceCard: ReturnType<typeof useCreateSpaceCard>;
  mutateCreateCard: ReturnType<typeof useCreateCard>;
}

// global space context menu
function GlobalSpaceContextMenu(props: ContextMenuComponentProps) {
  const {
    contextMenuInfo,
    viewRef,
    spaceId,
    mutateCreateSpaceCard,
    mutateCreateCard,
    setContextMenuInfo,
    space,
    setSpace,
  } = props;
  const { cards } = useQueryCardList();

  return (
    <>
      <button
        className="h-fit w-full cursor-pointer rounded px-2 py-1 text-left transition-all duration-300 hover:bg-gray-700"
        onClick={() => {
          mutateCreateCard.mutate(undefined, {
            onSuccess: (data) => {
              console.log('新增卡片成功', data.data);
              const view = viewRef.current;
              mutateCreateSpaceCard.mutate(
                {
                  spaceId,
                  targetCardId: data.data.card.id,
                  ...transformMouseClientPositionToViewPosition(
                    view,
                    contextMenuInfo?.x || 0,
                    contextMenuInfo?.y || 0,
                  ),
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
          setContextMenuInfo(null);
        }}
      >
        新增卡片
      </button>
      {/* <button className="h-fit w-full cursor-pointer rounded px-2 py-1 text-left transition-all duration-300 hover:bg-gray-700">
          將現有卡片加入
        </button> */}
    </>
  );
}

// space card context menu
function SpaceCardContextMenu(props: ContextMenuComponentProps) {
  const {
    contextMenuInfo,
    spaceId,
    mutateDeleteSpaceCard,
    setContextMenuInfo,
    space,
    setSpace,
  } = props;

  return (
    <>
      <button
        className="h-fit w-full cursor-pointer rounded px-2 py-1 text-left transition-all duration-300 hover:bg-gray-700"
        onClick={() => {}}
      >
        Fit to content
      </button>
      <button
        className="h-fit w-full cursor-pointer rounded px-2 py-1 text-left text-red-500 transition-all duration-300 hover:bg-gray-700"
        onClick={() => {
          if (!contextMenuInfo?.targetSpaceCardId) return;
          mutateDeleteSpaceCard.mutate({
            spaceId,
            spaceCardId: contextMenuInfo.targetSpaceCardId,
          });
          setContextMenuInfo(null);
          setSpace({
            ...space!,
            spaceCards: space!.spaceCards.filter(
              (spaceCard) => spaceCard.id !== contextMenuInfo.targetSpaceCardId,
            ),
          });
        }}
      >
        刪除卡片
      </button>
    </>
  );
}

// contextMenu: 右鍵選單
const ContextMenuComponent = React.forwardRef(
  (props: ContextMenuComponentProps, ref) => {
    const { contextMenuInfo } = props;

    return (
      <div
        className={`absolute flex h-fit w-fit min-w-48 flex-col gap-2 rounded-md bg-gray-800 p-1 text-gray-100 ${
          contextMenuInfo ? '' : 'hidden'
        }`}
        style={{
          left: contextMenuInfo ? contextMenuInfo.x : 0,
          top: contextMenuInfo ? contextMenuInfo.y : 0,
        }}
        ref={ref as React.RefObject<HTMLDivElement>}
      >
        {contextMenuInfo?.targetSpaceCardId && (
          <SpaceCardContextMenu {...props} />
        )}
        {!contextMenuInfo?.targetSpaceCardId && (
          <GlobalSpaceContextMenu {...props} />
        )}
      </div>
    );
  },
);

export default ContextMenuComponent;
