import { useEffect } from "react";
import useSocket from "../useSocket";
import { AxiosResponse } from "axios";
import {
  SpaceCardCreateResponseDTO,
  SpaceCardCreateRequestDTO,
  SpaceDto,
} from "@repo/shared-types";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

async function fetchCreateSpaceCard(
  spaceId: string,
  data: {
    targetCardId: string;
    x: number;
    y: number;
  }
) {
  return await axiosInstance.post<SpaceCardCreateResponseDTO>(
    `/space/${spaceId}/space-card`,
    data
  );
}

function useCreateSpaceCard(
  setLocalSpace: React.Dispatch<React.SetStateAction<SpaceDto>>,
  localSpace: SpaceDto
): UseMutationResult<
  AxiosResponse<SpaceCardCreateResponseDTO>,
  unknown,
  SpaceCardCreateRequestDTO & {
    spaceId: string;
  },
  unknown
> {
  const { socket } = useSocket(localSpace?.id);
  const queryClient = useQueryClient();
  const createSpaceCard = async (data: SpaceCardCreateResponseDTO) => {
    queryClient.invalidateQueries({
      queryKey: ["space", localSpace?.id],
    });
    queryClient.invalidateQueries({
      queryKey: ["spaces"],
    });
    if (!localSpace) {
      return;
    }
    setLocalSpace({
      ...localSpace,
      spaceCards: [...localSpace.spaceCards, data.spaceCard],
    });
  };

  const mutate = useMutation({
    mutationFn: (
      data: SpaceCardCreateRequestDTO & {
        spaceId: string;
      }
    ) => fetchCreateSpaceCard(data.spaceId, data),
    onSuccess: (data) => {},
  });

  useEffect(() => {
    socket?.on("space:card:create", (data: SpaceCardCreateResponseDTO) => {
      createSpaceCard(data);
    });

    return () => {
      socket?.off("space:card:create");
    };
  }, [localSpace?.id, localSpace?.spaceCards]);
  return mutate;
}

export default useCreateSpaceCard;
