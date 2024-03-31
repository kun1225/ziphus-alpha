import { useCallback, useEffect, useRef } from "react";

interface DragProps {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  clientX: number;
  clientY: number;
}

interface DraggableOptions {
  draggableItemRef: React.RefObject<Element>;
  containerRef?: React.RefObject<Element>;
  onDragStart?: (props: DragProps) => void;
  onDrag?: (props: DragProps) => void;
  onDragEnd?: (props: DragProps) => void;
  available?: boolean;
}

function useDraggable({
  draggableItemRef,
  containerRef,
  onDragStart,
  onDrag,
  onDragEnd,
  available = true,
}: DraggableOptions) {
  const lastClientXRef = useRef(0);
  const lastClientYRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handleDragStart = useCallback(
    (clientX: number, clientY: number) => {
      const containerRect = containerRef?.current?.getBoundingClientRect();

      const x = clientX - (containerRect?.left || 0);
      const y = clientY - (containerRect?.top || 0);
      isDraggingRef.current = true;
      lastClientXRef.current = x;
      lastClientYRef.current = y;

      if (onDragStart) {
        onDragStart({
          x,
          y,
          deltaX: 0,
          deltaY: 0,
          clientX: clientX,
          clientY: clientY,
        });
      }
    },
    [onDragStart],
  );

  const handleDrag = useCallback(
    (clientX: number, clientY: number) => {
      const containerRect = containerRef?.current?.getBoundingClientRect();
      const x = clientX - (containerRect?.left || 0);
      const y = clientY - (containerRect?.top || 0);

      if (onDrag) {
        onDrag({
          x,
          y,
          deltaX: x - lastClientXRef.current,
          deltaY: y - lastClientYRef.current,
          clientX: clientX,
          clientY: clientY,
        });
      }

      lastClientXRef.current = x;
      lastClientYRef.current = y;
    },
    [onDrag],
  );

  const handleDragEnd = useCallback(
    (clientX: number, clientY: number) => {
      const containerRect = containerRef?.current?.getBoundingClientRect();
      const x = clientX - (containerRect?.left || 0);
      const y = clientY - (containerRect?.top || 0);
      isDraggingRef.current = false;

      if (onDragEnd) {
        onDragEnd({
          x,
          y,
          deltaX: lastClientXRef.current - x,
          deltaY: lastClientYRef.current - y,
          clientX: clientX,
          clientY: clientY,
        });
      }

      lastClientXRef.current = x;
      lastClientYRef.current = y;
    },
    [onDragEnd],
  );

  useEffect(() => {
    const draggableItem = draggableItemRef.current;
    if (!draggableItem) {
      return;
    }

    const handleMouseStart = (event: MouseEvent) => {
      event.preventDefault();
      if (event.button !== 0) {
        return;
      }
      if (!available) {
        return;
      }
      handleDragStart(event.clientX, event.clientY);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current) {
        return;
      }
      if (event.button !== 0) {
        return;
      }
      if (!available) {
        return;
      }
      handleDrag(event.clientX, event.clientY);
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!isDraggingRef.current) {
        return;
      }
      if (event.button !== 0) {
        return;
      }
      if (!available) {
        return;
      }
      handleDragEnd(event.clientX, event.clientY);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (!available) {
        return;
      }
      event.preventDefault();
      handleDragStart(event.touches[0]!.clientX, event.touches[0]!.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isDraggingRef.current) {
        return;
      }
      if (!available) {
        return;
      }
      handleDrag(event.touches[0]!.clientX, event.touches[0]!.clientY);
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!isDraggingRef.current) {
        return;
      }
      if (!available) {
        return;
      }
      handleDragEnd(
        event.changedTouches[0]!.clientX,
        event.changedTouches[0]!.clientY,
      );
    };

    draggableItem.addEventListener("mousedown", handleMouseStart as any);
    draggableItem.addEventListener("touchstart", handleTouchStart as any);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      draggableItem.removeEventListener("mousedown", handleMouseStart as any);
      draggableItem.removeEventListener("touchstart", handleTouchStart as any);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [draggableItemRef, handleDragStart, handleDrag, handleDragEnd, available]);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) {
      return;
    }

    container.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
  }, [containerRef]);
}

export default useDraggable;
