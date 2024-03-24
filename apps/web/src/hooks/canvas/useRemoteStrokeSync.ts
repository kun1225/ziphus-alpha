import Stroke from "@/models/stroke";
import * as Y from "yjs";
import { useEffect, useRef, useState } from "react";

interface UseRemoteStrokeSyncProps {
  remoteYArray: Y.Array<any>;
  originalStrokesRef: React.MutableRefObject<Stroke[]>;
}
function useRemoteStrokeSync({
  remoteYArray,
  originalStrokesRef,
}: UseRemoteStrokeSyncProps) {
  const remoteRenderStrokesRef = useRef<Stroke[]>([]);

  useEffect(() => {
    function handleSync() {
      const remoteStrokes = remoteYArray.toJSON();
      remoteRenderStrokesRef.current = remoteStrokes.filter(
        (stroke: any) =>
          !originalStrokesRef.current.some(
            (originalStroke) => originalStroke.id === stroke.id,
          ),
      );
    }
    remoteYArray.observeDeep(handleSync);

    return () => remoteYArray.unobserveDeep(handleSync);
  }, []);

  return remoteRenderStrokesRef;
}

export default useRemoteStrokeSync;
