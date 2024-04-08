"use client";

import React, { useEffect, useRef } from "react";
import { View } from "@/models/view";
import transformMouseClientPositionToViewPosition from "@/utils/space/transformMouseClientPositionToViewPosition";

// 滑動移動視圖
const useViewTouch = (
  editorRef: React.RefObject<HTMLDivElement>,
  viewRef: React.MutableRefObject<View>
) => {
  const lastTouchPosition = useRef({ x: 0, y: 0 });
  const lastTwoPointDeltaDistance = useRef(0);

  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) return;

    const onScale = (
      touchCenterX: number,
      touchCenterY: number,
      touchScale: number
    ) => {
      const view = viewRef.current!;

      const newScale = Math.max(0.01, Math.min(2, touchScale));

      // 計算縮放中心點到視圖左上角的距離在縮放前後的變化量
      const { x: centerX, y: centerY } =
        transformMouseClientPositionToViewPosition(
          view,
          touchCenterX,
          touchCenterY
        );
      const { x: newCenterX, y: newCenterY } =
        transformMouseClientPositionToViewPosition(
          {
            x: view.x,
            y: view.y,
            scale: newScale,
          },
          touchCenterX,
          touchCenterY
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

    const onMove = (deltaX: number, deltaY: number) => {
      const view = viewRef.current!;

      viewRef.current = {
        x: view.x + deltaX,
        y: view.y + deltaY,
        scale: view.scale,
      };
    };

    const onTouchMove = (event: TouchEvent) => {
      const touches = event.touches;
      if (touches.length !== 2) {
        return;
      }
      event.preventDefault();
      const rect = editor.getBoundingClientRect();
      const touch1x = touches[0]!.clientX - rect.left;
      const touch1y = touches[0]!.clientY - rect.top;
      const touch2x = touches[1]!.clientX - rect.left;
      const touch2y = touches[1]!.clientY - rect.top;

      const centerX = (touch1x + touch2x) / 2;
      const centerY = (touch1y + touch2y) / 2;

      const twoPointDeltaDistance = Math.sqrt(
        (touch1x - touch2x) ** 2 + (touch1y - touch2y) ** 2
      );

      const deltaScale =
        twoPointDeltaDistance - lastTwoPointDeltaDistance.current;

      const { x: viewCenterX, y: viewCenterY } =
        transformMouseClientPositionToViewPosition(
          viewRef.current,
          centerX,
          centerY
        );

      const { x: lastViewCenterX, y: lastViewCenterY } =
        transformMouseClientPositionToViewPosition(
          viewRef.current,
          lastTouchPosition.current.x,
          lastTouchPosition.current.y
        );

      onMove(
        (viewCenterX - lastViewCenterX) * viewRef.current.scale,
        (viewCenterY - lastViewCenterY) * viewRef.current.scale
      );
      onScale(centerX, centerY, viewRef.current.scale + deltaScale * 0.002);

      lastTouchPosition.current.x = centerX;
      lastTouchPosition.current.y = centerY;
      lastTwoPointDeltaDistance.current = twoPointDeltaDistance;
    };

    const onTouchStart = (event: TouchEvent) => {
      const touches = event.touches;
      if (touches.length !== 2) {
        return;
      }
      const rect = editor.getBoundingClientRect();
      const touch1x = touches[0]!.clientX - rect.left;
      const touch1y = touches[0]!.clientY - rect.top;
      const touch2x = touches[1]!.clientX - rect.left;
      const touch2y = touches[1]!.clientY - rect.top;
      event.preventDefault();

      const centerX = (touch1x + touch2x) / 2;
      const centerY = (touch1y + touch2y) / 2;
      lastTouchPosition.current.x = centerX;
      lastTouchPosition.current.y = centerY;
      lastTwoPointDeltaDistance.current = Math.sqrt(
        (touch1x - touch2x) ** 2 + (touch1y - touch2y) ** 2
      );
    };

    editor.addEventListener("touchmove", onTouchMove, { passive: false });
    editor.addEventListener("touchstart", onTouchStart, { passive: false });

    return () => {
      editor.removeEventListener("touchmove", onTouchMove);
      editor.removeEventListener("touchstart", onTouchStart);
    };
  }, []);
};

export default useViewTouch;
