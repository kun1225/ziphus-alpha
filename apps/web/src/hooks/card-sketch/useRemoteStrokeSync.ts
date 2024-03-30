import Stroke from '@/models/stroke';
import * as Y from 'yjs';
import { useEffect, useState } from 'react';
import { SocketIOProvider } from 'y-socket.io';

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

    setTimeout(() => {
      handleSync();
    }, 100);

    return () => remoteYArray.unobserveDeep(handleSync);
  }, [remoteYArray, originalStrokes]);

  return remoteRenderStrokes;
}

export default useRemoteStrokeSync;
