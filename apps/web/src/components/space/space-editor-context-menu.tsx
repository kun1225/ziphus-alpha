"use client";

import React, { useCallback, useState } from "react";
import {
  MdAddToPhotos,
  MdOutlineVerticalAlignTop,
  MdOutlineVerticalAlignBottom,
  MdArrowUpward,
  MdArrowDownward,
  MdDelete,
  MdOutlineDriveFileMoveRtl,
} from "react-icons/md";
import { SlSizeActual } from "react-icons/sl";
import { SpaceCardUpdateLayerRequestDTO, SpaceDto } from "@repo/shared-types";
import { Listbox, ListboxSection, ListboxItem } from "@/components/nextui";
import useCreateCard from "@/hooks/card/useCreateCard";
import useQueryCardList from "@/hooks/card/useQueryCardList";
import useCreateSpaceCard from "@/hooks/space/useCreateSpaceCard";
import useDeleteSpaceCard from "@/hooks/space/useDeleteSpaceCard";
import useUpdateSpaceCardLayer from "@/hooks/space/useUpdateSpaceCardLayer";
import { View } from "@/models/view";
import transformMouseClientPositionToViewPosition from "@/utils/space/transformMouseClientPositionToViewPosition";

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
  mutateUpdateSpaceCardLayer: ReturnType<typeof useUpdateSpaceCardLayer>;
}

// global space context menu
function GlobalSpaceContextMenu(
  props: ContextMenuComponentProps
): React.ReactNode {
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
  const [isAddOriginalCard, setIsAddOriginalCard] = useState(false);
  const { cards } = useQueryCardList();

  const handleAddCard = useCallback(() => {
    mutateCreateCard.mutate(undefined, {
      onSuccess: (data) => {
        console.log("新增卡片成功", data.data);
        const view = viewRef.current;
        mutateCreateSpaceCard.mutate(
          {
            spaceId,
            targetCardId: data.data.card.id,
            ...transformMouseClientPositionToViewPosition(
              view,
              contextMenuInfo?.x || 0,
              contextMenuInfo?.y || 0
            ),
          },
          {
            onSuccess: (data: any) => {
              console.log("新增卡片成功", data.data);
              setSpace({
                ...space!,
                spaceCards: [...space!.spaceCards, data.data.spaceCard],
              });
            },
          }
        );
      },
      onError: (error) => {
        console.error("新增卡片失敗", error);
      },
    });
    setContextMenuInfo(null);
  }, [
    contextMenuInfo,
    mutateCreateCard,
    mutateCreateSpaceCard,
    setSpace,
    space,
    spaceId,
  ]);

  return (
    <>
      <Listbox>
        <ListboxSection title="操作">
          <ListboxItem
            key="add-card"
            description="新增一張空白卡片"
            startContent={<MdAddToPhotos />}
            onClick={handleAddCard}
          >
            新增卡片
          </ListboxItem>
          <ListboxItem
            key="add-original-card"
            description="新增一張現有卡片"
            startContent={<MdOutlineDriveFileMoveRtl />}
            onClick={() => setIsAddOriginalCard(!isAddOriginalCard)}
          >
            將現有卡片加入
          </ListboxItem>
        </ListboxSection>
      </Listbox>
      {isAddOriginalCard && (
        <Listbox className=" absolute max-h-96 w-48 translate-x-full translate-y-0 overflow-y-auto rounded-md bg-gray-800 p-1 text-gray-100 ">
          <ListboxSection title="選擇卡片">
            {cards.map((card) => (
              <ListboxItem
                key={card.id}
                aria-label="card"
                onClick={() => {
                  mutateCreateSpaceCard.mutate(
                    {
                      spaceId,
                      targetCardId: card.id,
                      ...transformMouseClientPositionToViewPosition(
                        viewRef.current,
                        contextMenuInfo?.x || 0,
                        contextMenuInfo?.y || 0
                      ),
                    },
                    {
                      onSuccess: (data: any) => {
                        console.log("新增卡片成功", data.data);
                        setSpace({
                          ...space!,
                          spaceCards: [
                            ...space!.spaceCards,
                            data.data.spaceCard,
                          ],
                        });
                      },
                    }
                  );
                  setIsAddOriginalCard(false);
                  setContextMenuInfo(null);
                }}
              >
                <div
                  className="h-36 w-full overflow-hidden rounded-md p-2"
                  dangerouslySetInnerHTML={{ __html: card.content }}
                ></div>
              </ListboxItem>
            ))}
          </ListboxSection>
        </Listbox>
      )}
    </>
  );
}

// space card context menu
function SpaceCardContextMenu(
  props: ContextMenuComponentProps
): React.ReactNode {
  const {
    contextMenuInfo,
    spaceId,
    mutateDeleteSpaceCard,
    mutateUpdateSpaceCardLayer,
    setContextMenuInfo,
    space,
    setSpace,
  } = props;

  const layerOptions: {
    label: string;
    description: string;
    icon: React.ReactNode;
    value: SpaceCardUpdateLayerRequestDTO["operation"];
  }[] = [
    {
      label: "置頂",
      description: "將卡片置頂",
      icon: <MdOutlineVerticalAlignTop />,
      value: "top",
    },
    {
      label: "置底",
      description: "將卡片置底",
      icon: <MdOutlineVerticalAlignBottom />,
      value: "bottom",
    },
    {
      label: "上移一層",
      description: "將卡片上移一層",
      icon: <MdArrowUpward />,
      value: "up",
    },
    {
      label: "下移一層",
      description: "將卡片下移一層",
      icon: <MdArrowDownward />,
      value: "down",
    },
  ];

  return (
    <Listbox>
      <ListboxSection title="順序" showDivider>
        {layerOptions.map((layerOption) => (
          <ListboxItem
            key={layerOption.value}
            description={layerOption.description}
            startContent={layerOption.icon}
            onClick={() => {
              if (!contextMenuInfo?.targetSpaceCardId) return;
              mutateUpdateSpaceCardLayer.mutate({
                spaceId,
                spaceCardId: contextMenuInfo.targetSpaceCardId,
                operation: layerOption.value,
              });
              setContextMenuInfo(null);
            }}
          >
            {layerOption.label}
          </ListboxItem>
        ))}
      </ListboxSection>
      <ListboxSection title="操作">
        <ListboxItem
          key={"fit-content"}
          description="將卡片大小調整至與文字內容相同的大小"
          startContent={<SlSizeActual />}
          onClick={() => {
            const event = new CustomEvent("space-card-fit-content", {
              detail: {
                spaceCardId: contextMenuInfo?.targetSpaceCardId,
              },
            });
            window.dispatchEvent(event);
          }}
        >
          大小適應
        </ListboxItem>
        <ListboxItem
          key={"delete-card"}
          description="從本空間中刪除卡片"
          startContent={<MdDelete />}
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
                (spaceCard) =>
                  spaceCard.id !== contextMenuInfo.targetSpaceCardId
              ),
            });
          }}
        >
          刪除卡片
        </ListboxItem>
      </ListboxSection>
    </Listbox>
  );
}

// contextMenu: 右鍵選單
const ContextMenuComponent = React.forwardRef(
  (props: ContextMenuComponentProps, ref) => {
    const { contextMenuInfo } = props;

    return (
      <div
        className={`absolute flex h-fit w-fit min-w-48 flex-col gap-2 rounded-md bg-gray-800 p-1 text-gray-100 ${
          contextMenuInfo ? "" : "hidden"
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
  }
);

export default ContextMenuComponent;
