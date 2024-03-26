"use client";
import useQuerySpaceById from "@/hooks/space/useQuerySpaceById";
import React, { useEffect, useRef, useState } from "react";
import SpaceCardEditor from "./space-card-editor";
import useYJSProvide from "@/hooks/card/useYJSProvider";
import { useParams } from "next/navigation";
import useCreateSpaceCard from "@/hooks/space/useCreateSpaceCard";
import useQueryCardList from "@/hooks/card/useQueryCardList";
import useCreateCard from "@/hooks/card/useCreateCard";

export interface View {
  x: number;
  y: number;
  scale: number;
}

export interface ContextMenu {
  x: number;
  y: number;
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
  setContextMenu: (contextMenu: ContextMenu | null) => void,
  contextMenuComponentRef: React.RefObject<HTMLDivElement>,
) => {
  const mouseDownTimeRef = useRef(0);
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      if (Date.now() - mouseDownTimeRef.current > 200) return;
      const editor = editorRef.current;
      if (!editor) return;
      const rect = editor.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setContextMenu({
        x,
        y,
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
        setContextMenu(null);
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

// contextMenu: 右鍵選單
interface ContextMenuComponentProps {
  contextMenu: ContextMenu | null;
  viewRef: React.MutableRefObject<View>;
  spaceId: string;
}
const ContextMenuComponent = React.forwardRef(
  ({ contextMenu, viewRef, spaceId }: ContextMenuComponentProps, ref) => {
    const mutateCreateSpaceCard = useCreateSpaceCard();
    const mutateCreateCard = useCreateCard();
    const { cards } = useQueryCardList();

    return (
      <div
        className={`absolute flex h-fit w-fit flex-col gap-2 rounded-md bg-gray-800 p-2 text-gray-100 ${
          contextMenu ? "" : "hidden"
        }`}
        style={{
          left: contextMenu ? contextMenu.x : 0,
          top: contextMenu ? contextMenu.y : 0,
        }}
        ref={ref as React.RefObject<HTMLDivElement>}
      >
        <button
          className="h-fit w-full cursor-pointer rounded px-2 py-1 text-left transition-all duration-300 hover:bg-gray-700"
          onClick={() =>
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
                      contextMenu?.x || 0,
                      contextMenu?.y || 0,
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
            })
          }
        >
          新增卡片
        </button>
        {/* <button className="h-fit w-full cursor-pointer rounded px-2 py-1 text-left transition-all duration-300 hover:bg-gray-700">
          將現有卡片加入
        </button> */}
      </div>
    );
  },
);

export default function SpaceEditor() {
  const { id } = useParams();
  const spaceId = id as string;
  const { space } = useQuerySpaceById(spaceId);
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
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  useViewScroll(whiteBoardRef, viewRef);
  const isViewDraggingRef = useViewDrag(
    whiteBoardRef,
    viewRef,
    !focusSpaceCardId,
  );
  useViewContextMenu(whiteBoardRef, setContextMenu, contextMenuComponentRef);
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
        contextMenu={contextMenu}
        ref={contextMenuComponentRef}
        viewRef={viewRef}
        spaceId={spaceId}
      />
    </div>
  );
}
