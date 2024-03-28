import {
  SpaceCardDTO,
  SpaceCardImmediateUpdatePositionRequestDTO,
} from "@repo/shared-types";
import useSocket from "@/hooks/useSocket";
import { useEffect } from "react";

function useUpdateSpaceCardPosition(
  spaceCardRef: React.MutableRefObject<SpaceCardDTO>,
) {
  const { socketEmitWithAuth, socket } = useSocket(
    spaceCardRef.current.targetSpaceId,
  );

  function handleUpdatePosition(
    data: SpaceCardImmediateUpdatePositionRequestDTO,
  ) {
    socketEmitWithAuth("space:card:update-position", data);
  }

  useEffect(() => {
    socket.on(
      `space:card:${spaceCardRef.current.id}:update-position`,
      (data: SpaceCardImmediateUpdatePositionRequestDTO) => {
        spaceCardRef.current.x = data.x;
        spaceCardRef.current.y = data.y;
      },
    );

    return () => {
      socket.off(`space:card:${spaceCardRef.current.id}:update-position`);
    };
  }, [spaceCardRef.current.id]);

  return { handleUpdatePosition };
}

export default useUpdateSpaceCardPosition;
