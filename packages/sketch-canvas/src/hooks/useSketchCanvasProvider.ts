/* eslint-disable no-unused-vars */
import { useCallback, useState } from 'react';
import { Shape } from '../models/shapes';

export interface SketchCanvasProvider {
    getShapes: () => Shape[];
    setShapes: (shapes: Shape[]) => void;
    addShape: (shape: Shape) => void;
    setShape: (id: string, shape: Shape) => void;
    removeShape: (id: string) => void;
    clear: () => void;
}

export const useSketchCanvasProvider = (): SketchCanvasProvider => {
    const [shapes, setShapes] = useState<Shape[]>([]);

    const addShape = useCallback((shape: Shape) => {
        setShapes((prevShapes) => [...prevShapes, shape]);
    }, [shapes]);

    const setShape = useCallback((id: string, newShape: Shape) => {
        setShapes((prevShapes) =>
            prevShapes.map((shape) => (shape.id === id ? newShape : shape))
        );
    }, []);

    const removeShape = useCallback((id: string) => {
        setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== id));
    }, []);

    const clear = useCallback(() => {
        setShapes([]);
    }, []);

    return { getShapes: () => shapes, addShape, setShape, removeShape, clear, setShapes };
};
