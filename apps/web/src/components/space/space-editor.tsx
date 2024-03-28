"use client";
import useQuerySpaceById from "@/hooks/space/useQuerySpaceById";
import React, { useEffect, useRef, useState } from "react";
import SpaceCardEditor from "./space-card-editor";
import useYJSProvide from "@/hooks/card/useYJSProvider";
import { useParams } from "next/navigation";
import useCreateSpaceCard from "@/hooks/space/useCreateSpaceCard";
import useQueryCardList from "@/hooks/card/useQueryCardList";
import useCreateCard from "@/hooks/card/useCreateCard";
import useDeleteSpaceCard from "@/hooks/space/useDeleteSpaceCard";
import { SpaceGetByIdResponseDTO } from "@repo/shared-types";

export interface View {
  x: number;
  y: number;
  scale: number;
}

export interface ContextMenuInfo {
  x: number;
  y: number;
  targetSpaceCardId?: string;
}

// 將滑鼠在編輯器上的相對位置轉換成實際位置
const transformMouseClientPositionToViewPosition = (
  view: View,
  clientX: number,
  clientY: number,
) => {
  const newX = (clientX - view.x) / view.scale;
  const newY = (clientY - view.y) / view.scale;
  return {
    x: newX,
    y: newY,
  };
};

// 滾輪放大縮小
const useViewScroll = (
  editorRef: React.RefObject<HTMLDivElement>,
  viewRef: React.MutableRefObject<View>,
) => {
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = editor.getBoundingClientRect();
      const view = viewRef.current!;
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const newScale = Math.max(
        0.01,
        Math.min(2, view.scale - event.deltaY * 0.0005),
      );

      // 計算縮放中心點到視圖左上角的距離在縮放前後的變化量
      const { x: centerX, y: centerY } =
        transformMouseClientPositionToViewPosition(view, mouseX, mouseY);
      const { x: newCenterX, y: newCenterY } =
        transformMouseClientPositionToViewPosition(
          {
            x: view.x,
            y: view.y,
            scale: newScale,
          },
          mouseX,
          mouseY,
        );
      const deltaX = (newCenterX - centerX) * newScale;
      const deltaY = (newCenterY - centerY) * newScale;

      // 更新視圖的位置和縮放值
      viewRef.current = {
        x: view.x + deltaX,
        y: view.y + deltaY,
        scale: newScale,
      };
    };

    editor.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      editor.removeEventListener("wheel", onWheel);
    };
  }, []);
};

// 右鍵單點招喚選單
const useViewContextMenu = (
  editorRef: React.RefObject<HTMLDivElement>,
  setContextMenuInfo: (contextMenuInfo: ContextMenuInfo | null) => void,
  contextMenuComponentRef: React.RefObject<HTMLDivElement>,
) => {
  const mouseDownTimeRef = useRef(0);
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      if (Date.now() - mouseDownTimeRef.current > 100) return;
      const editor = editorRef.current;
      if (!editor) return;
      const rect = editor.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const targetSpaceCardId = (event.target as HTMLElement).closest(
        ".space-card",
      )?.id;

      setContextMenuInfo({
        x,
        y,
        targetSpaceCardId,
      });
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 2) {
        mouseDownTimeRef.current = Date.now();
      }

      // 如果點擊到選單以外的地方，就關閉選單
      if (
        contextMenuComponentRef.current &&
        !contextMenuComponentRef.current.contains(event.target as Node)
      ) {
        setContextMenuInfo(null);
      }
    };

    editor.addEventListener("contextmenu", onContextMenu);
    editor.addEventListener("mousedown", handleMouseDown);

    return () => {
      editor.removeEventListener("contextmenu", onContextMenu);
      editor.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);
};

// 右鍵按住拖曳視野
const useViewDrag = (
  editorRef: React.RefObject<HTMLDivElement>,
  viewRef: React.MutableRefObject<View>,
  availableMove: boolean = true,
) => {
  const prevXRef = useRef(0);
  const prevYRef = useRef(0);
  const isDraggingRef = useRef(false);
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const onMouseDown = (event: MouseEvent) => {
      if (!availableMove) return;
      if (event.button === 2) {
        isDraggingRef.current = true;
        prevXRef.current = event.clientX;
        prevYRef.current = event.clientY;
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!availableMove) return;
      if (isDraggingRef.current) {
        const view = viewRef.current!;
        const deltaX = event.clientX - prevXRef.current;
        const deltaY = event.clientY - prevYRef.current;
        prevXRef.current = event.clientX;
        prevYRef.current = event.clientY;
        viewRef.current = {
          x: view.x + deltaX,
          y: view.y + deltaY,
          scale: view.scale,
        };
      }
    };

    const onMouseUp = () => {
      if (!availableMove) return;
      isDraggingRef.current = false;
    };

    editor.addEventListener("mousedown", onMouseDown);
    editor.addEventListener("mousemove", onMouseMove);
    editor.addEventListener("mouseup", onMouseUp);

    return () => {
      editor.removeEventListener("mousedown", onMouseDown);
      editor.removeEventListener("mousemove", onMouseMove);
      editor.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return isDraggingRef;
};

// 隨時更新視差效果
const useViewTransformUpdate = (
  parallaxBoardRef: React.RefObject<HTMLDivElement>,
  viewRef: React.MutableRefObject<View>,
) => {
  const lastViewRef = useRef<View>({
    x: 0,
    y: 0,
    scale: 1,
  });
  useEffect(() => {
    let animationFrameId = 0;
    function handleViewChange() {
      animationFrameId = requestAnimationFrame(handleViewChange);
      const parallaxBoard = parallaxBoardRef.current;
      if (!parallaxBoard) return;
      if (
        lastViewRef.current.x === viewRef.current.x &&
        lastViewRef.current.y === viewRef.current.y &&
        lastViewRef.current.scale === viewRef.current.scale
      ) {
        return;
      }

      parallaxBoard.style.transform = `translate(${viewRef.current.x}px, ${viewRef.current.y}px) scale(${viewRef.current.scale})`;
      lastViewRef.current = { ...viewRef.current };
    }
    handleViewChange();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
};

interface ContextMenuComponentProps {
  contextMenuInfo: ContextMenuInfo | null;
  setContextMenuInfo: (contextMenuInfo: ContextMenuInfo | null) => void;
  viewRef: React.MutableRefObject<View>;
  spaceId: string;
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
  } = props;
  const { cards } = useQueryCardList();

  return (
    <>
      <button
        className="h-fit w-full cursor-pointer rounded px-2 py-1 text-left transition-all duration-300 hover:bg-gray-700"
        onClick={() => {
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
                    contextMenuInfo?.y || 0,
                  ),
                },
                {
                  onSuccess: (data: any) => {
                    console.log("新增卡片成功", data.data);
                  },
                },
              );
            },
            onError: (error) => {
              console.error("新增卡片失敗", error);
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
  } = props;

  return (
    <>
      <button
        className="h-fit w-full cursor-pointer rounded px-2 py-1 text-left transition-all duration-300 hover:bg-gray-700"
        onClick={() => {
          if (!contextMenuInfo?.targetSpaceCardId) return;
          mutateDeleteSpaceCard.mutate({
            spaceId,
            spaceCardId: contextMenuInfo.targetSpaceCardId,
          });
          setContextMenuInfo(null);
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
        className={`absolute flex h-fit w-fit flex-col gap-2 rounded-md bg-gray-800 p-2 text-gray-100 ${
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
  },
);

export default function SpaceEditor({
  initialSpace,
}: {
  initialSpace: SpaceGetByIdResponseDTO["space"];
}) {
  if (!initialSpace) {
    return <div>Space not found</div>;
  }
  const spaceId = initialSpace?.id;
  const [space, setSpace] = useState<SpaceGetByIdResponseDTO["space"] | null>(
    initialSpace,
  );
  const mutateDeleteSpaceCard = useDeleteSpaceCard(setSpace, space);
  const mutateCreateSpaceCard = useCreateSpaceCard(setSpace, space);
  const mutateCreateCard = useCreateCard();

  useEffect(() => {
    setSpace(initialSpace);
  }, [initialSpace]);
  const { doc, provider, status } = useYJSProvide({
    spaceId,
  });
  const viewRef = useRef<View>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const whiteBoardRef = useRef<HTMLDivElement>(null);

  const parallaxBoardRef = useRef<HTMLDivElement | null>(null);
  const contextMenuComponentRef = useRef<HTMLDivElement | null>(null);
  const [focusSpaceCardId, setFocusSpaceCardId] = useState<string | null>(null);
  const [selectedSpaceCardIdList, setSelectedSpaceCardIdList] = useState<
    string[]
  >([]);
  const [contextMenuInfo, setContextMenuInfo] =
    useState<ContextMenuInfo | null>(null);
  useViewScroll(whiteBoardRef, viewRef);
  const isViewDraggingRef = useViewDrag(
    whiteBoardRef,
    viewRef,
    !focusSpaceCardId,
  );
  useViewContextMenu(
    whiteBoardRef,
    setContextMenuInfo,
    contextMenuComponentRef,
  );
  useViewTransformUpdate(parallaxBoardRef, viewRef);

  return (
    <div
      ref={whiteBoardRef}
      className="relative h-full w-full overflow-hidden bg-black"
      onClick={() => {
        setFocusSpaceCardId(null);
        setSelectedSpaceCardIdList([]);
      }}
    >
      {/* 內容 */}
      <div
        className=" absolute left-0 top-0 origin-top-left"
        ref={parallaxBoardRef}
      >
        {space?.spaceCards.map((spaceCard) => (
          <SpaceCardEditor
            key={spaceCard.id}
            initialSpaceCard={spaceCard}
            socketIOProvider={provider}
            doc={doc}
            viewRef={viewRef}
            isFocus={focusSpaceCardId === spaceCard.id}
            onClick={(e) => {
              e.stopPropagation();
              setFocusSpaceCardId(spaceCard.id);
            }}
          />
        ))}
      </div>
      {/* 右鍵生成選單 */}
      <ContextMenuComponent
        contextMenuInfo={contextMenuInfo}
        setContextMenuInfo={setContextMenuInfo}
        ref={contextMenuComponentRef}
        viewRef={viewRef}
        spaceId={spaceId}
        mutateDeleteSpaceCard={mutateDeleteSpaceCard}
        mutateCreateSpaceCard={mutateCreateSpaceCard}
        mutateCreateCard={mutateCreateCard}
      />
    </div>
  );
}
