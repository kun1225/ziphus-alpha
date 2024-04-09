"use client";

import React, { useRef, useState } from "react";
import { CardEditorSEO } from "../card/card-editor";
import {
  SpaceDto,
  type SpaceGetByIdWithCardResponseDTO,
} from "@repo/shared-types";
import useCreateCard from "@/hooks/card/useCreateCard";
import useCreateSpaceCard from "@/hooks/space/useCreateSpaceCard";
import useDeleteSpaceCard from "@/hooks/space/useDeleteSpaceCard";
import useUpdateSpaceCardLayer from "@/hooks/space/useUpdateSpaceCardLayer";
import useViewContextMenu from "@/hooks/space/useViewContextMenu";
import useViewDrag from "@/hooks/space/useViewDrag";
import useViewScroll from "@/hooks/space/useViewScroll";
import useViewTouch from "@/hooks/space/useViewTouch";
import useViewTransformUpdate from "@/hooks/space/useViewTransformUpdate";
import useCanvasEditor from "@/hooks/useCanvasEditor";
import { View } from "@/models/view";
import SpaceCardEditor from "./space-card-editor";
import ContextMenuComponent, {
  ContextMenuInfo,
} from "./space-editor-context-menu";
import SpaceToolbar from "./space-toolbar";

export default function SpaceEditor({
  initialSpace,
}: {
  initialSpace: SpaceGetByIdWithCardResponseDTO["space"];
}) {
  const [space, setSpace] = useState<SpaceDto>(initialSpace as SpaceDto);

  const {
    editMode,
    setEditMode,
    sketchMode,
    setSketchMode,
    pencilInfo,
    setPencilInfo,
    eraserInfo,
    setEraserInfo,
  } = useCanvasEditor();

  const mutateDeleteSpaceCard = useDeleteSpaceCard(setSpace, space);
  const mutateCreateSpaceCard = useCreateSpaceCard(setSpace, space);
  const mutateCreateCard = useCreateCard();
  const mutateUpdateSpaceCardLayer = useUpdateSpaceCardLayer(setSpace, space);

  const viewRef = useRef<View>({
    x: 0,
    y: 0,
    scale: 1,
  });

  const whiteBoardRef = useRef<HTMLDivElement>(null);
  const parallaxBoardRef = useRef<HTMLDivElement | null>(null);
  const contextMenuComponentRef = useRef<HTMLDivElement | null>(null);
  const [focusSpaceCardId, setFocusSpaceCardId] = useState<string | null>(null);
  const mouseDownTimeRef = useRef<number>(0);
  const [selectedSpaceCardIdList, setSelectedSpaceCardIdList] = useState<
    string[]
  >([]);
  const [contextMenuInfo, setContextMenuInfo] =
    useState<ContextMenuInfo | null>(null);
  useViewScroll(whiteBoardRef, viewRef);
  useViewTouch(whiteBoardRef, viewRef);
  useViewDrag(whiteBoardRef, viewRef, !focusSpaceCardId);
  useViewContextMenu(
    whiteBoardRef,
    setContextMenuInfo,
    contextMenuComponentRef
  );
  useViewTransformUpdate(parallaxBoardRef, viewRef);

  return (
    <div
      ref={whiteBoardRef}
      className="relative h-full w-full touch-none overflow-hidden bg-black"
      onClick={() => {
        setFocusSpaceCardId(null);
        setSelectedSpaceCardIdList([]);
      }}
    >
      {/* 內容 */}
      <div
        className=" absolute left-0 top-0 z-0 origin-top-left"
        ref={parallaxBoardRef}
      >
        {space?.spaceCards.map((spaceCard) => (
          <SpaceCardEditor
            key={spaceCard.id}
            initialSpaceCard={spaceCard}
            viewRef={viewRef}
            isFocus={focusSpaceCardId === spaceCard.id}
            onMouseDown={(e) => {
              if (e.button !== 2) return;
              mouseDownTimeRef.current = Date.now();
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (Date.now() - mouseDownTimeRef.current > 300) {
                return;
              }
              setSelectedSpaceCardIdList([spaceCard.id]);
              setFocusSpaceCardId(spaceCard.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setFocusSpaceCardId(spaceCard.id);
            }}
            layers={space.layers}
          >
            <CardEditorSEO
              initialCard={
                initialSpace?.spaceCards?.find(
                  (initialSpaceSpaceCard) =>
                    initialSpaceSpaceCard.targetCardId ===
                    spaceCard.targetCardId
                )?.card || null
              }
              cardId={spaceCard.targetCardId}
              isFocus={focusSpaceCardId === spaceCard.id}
              isEditable={true}
              editMode={editMode}
              sketchMode={sketchMode}
              pencilInfo={pencilInfo}
              eraserInfo={eraserInfo}
              spaceCardId={spaceCard.id}
            />
          </SpaceCardEditor>
        ))}
      </div>
      {/* 繪圖工具 */}
      <SpaceToolbar
        focusSpaceCardId={focusSpaceCardId}
        editMode={editMode}
        setEditMode={setEditMode}
        sketchMode={sketchMode}
        setSketchMode={setSketchMode}
        pencilInfo={pencilInfo}
        setPencilInfo={setPencilInfo}
        eraserInfo={eraserInfo}
        setEraserInfo={setEraserInfo}
        mutateCreateSpaceCard={mutateCreateSpaceCard}
        mutateCreateCard={mutateCreateCard}
        mutateDeleteSpaceCard={mutateDeleteSpaceCard}
        space={space}
        setSpace={setSpace}
        viewRef={viewRef}
        editorRef={whiteBoardRef}
      />
      {/* 右鍵生成選單 */}
      <ContextMenuComponent
        contextMenuInfo={contextMenuInfo}
        setContextMenuInfo={setContextMenuInfo}
        ref={contextMenuComponentRef}
        viewRef={viewRef}
        spaceId={space!.id}
        mutateDeleteSpaceCard={mutateDeleteSpaceCard}
        mutateCreateSpaceCard={mutateCreateSpaceCard}
        mutateCreateCard={mutateCreateCard}
        mutateUpdateSpaceCardLayer={mutateUpdateSpaceCardLayer}
        space={space}
        setSpace={setSpace}
      />
    </div>
  );
}
