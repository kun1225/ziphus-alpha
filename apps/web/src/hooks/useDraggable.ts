import { useCallback, useEffect, useRef } from 'react';

interface DragProps {
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    clientX: number;
    clientY: number;
    event: React.DragEvent<Element>;
}

interface DraggableOptions {
    draggableItemRef: React.RefObject<Element>;
    containerRef?: React.RefObject<Element>;
    onDragStart?: (props: DragProps) => void;
    onDrag?: (props: DragProps) => void;
    onDragEnd?: (props: DragProps) => void;
}

function useDraggable({
    draggableItemRef,
    containerRef,
    onDragStart,
    onDrag,
    onDragEnd,
}: DraggableOptions) {
    const lastClientXRef = useRef(0);
    const lastClientYRef = useRef(0);
    const isDraggingRef = useRef(false);

    const handleDragStart = useCallback((event: React.DragEvent<Element>) => {
        event.dataTransfer.effectAllowed = 'move';
        const containerRect = containerRef?.current?.getBoundingClientRect();

        const x = event.clientX - (containerRect?.left || 0);
        const y = event.clientY - (containerRect?.top || 0);
        isDraggingRef.current = true;
        lastClientXRef.current = x;
        lastClientYRef.current = y;

        if (onDragStart) {
            onDragStart({
                event,
                x,
                y,
                deltaX: 0,
                deltaY: 0,
                clientX: event.clientX,
                clientY: event.clientY,
            });
        }
    }, [onDragStart]);

    const handleDrag = useCallback((event: React.DragEvent<Element>) => {
        const containerRect = containerRef?.current?.getBoundingClientRect();
        const x = event.clientX - (containerRect?.left || 0);
        const y = event.clientY - (containerRect?.top || 0);

        console.log('handleDrag', x, y);

        if (onDrag) {
            onDrag({
                event,
                x,
                y,
                deltaX: x - lastClientXRef.current,
                deltaY: y - lastClientYRef.current,
                clientX: event.clientX,
                clientY: event.clientY,
            });
        }


        lastClientXRef.current = x;
        lastClientYRef.current = y;
    }, [onDrag]);

    const handleDragEnd = useCallback((event: React.DragEvent<Element>) => {
        const containerRect = containerRef?.current?.getBoundingClientRect();
        const x = event.clientX - (containerRect?.left || 0);
        const y = event.clientY - (containerRect?.top || 0);
        isDraggingRef.current = false;

        if (onDragEnd) {
            onDragEnd({
                event,
                x,
                y,
                deltaX: lastClientXRef.current - x,
                deltaY: lastClientYRef.current - y,
                clientX: event.clientX,
                clientY: event.clientY,
            });
        }

        lastClientXRef.current = x;
        lastClientYRef.current = y;
    }, [onDragEnd]);

    useEffect(() => {
        const draggableItem = draggableItemRef.current;
        if (!draggableItem) {
            return;
        }

        draggableItem.addEventListener('dragstart', handleDragStart as any);
        draggableItem.addEventListener('drag', handleDrag as any);
        draggableItem.addEventListener('dragend', handleDragEnd as any);

        return () => {
            draggableItem.removeEventListener('dragstart', handleDragStart as any);
            draggableItem.removeEventListener('drag', handleDrag as any);
            draggableItem.removeEventListener('dragend', handleDragEnd as any);
        };
    }, [draggableItemRef, handleDragStart, handleDrag, handleDragEnd]);

    useEffect(() => {
        const container = containerRef?.current;
        if (!container) {
            return;
        }

        container.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
    }, [containerRef]);
}

export default useDraggable;