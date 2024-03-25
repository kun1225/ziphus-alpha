import Stroke from '@/models/stroke';
import * as Y from 'yjs';
import { useEffect, useRef, useState } from 'react';

interface UseRemoteStrokeSyncProps {
  remoteYArray: Y.Array<any>;
  originalStrokes: Stroke[];
}
function useRemoteStrokeSync({
  remoteYArray,
  originalStrokes,
}: UseRemoteStrokeSyncProps) {
  const [remoteRenderStrokes, setRemoteRenderStrokes] = useState<Stroke[]>([]);

  useEffect(() => {
    function handleSync() {
      const remoteStrokes = remoteYArray.toJSON();
      setRemoteRenderStrokes(remoteStrokes.filter(
        (stroke: any) =>
          !originalStrokes.some(
            (originalStroke: any) => originalStroke.id === stroke.id,
          ),
      ));
    }
    remoteYArray.observeDeep(handleSync);

    return () => remoteYArray.unobserveDeep(handleSync);
  }, []);

  return remoteRenderStrokes;
}

export default useRemoteStrokeSync;
