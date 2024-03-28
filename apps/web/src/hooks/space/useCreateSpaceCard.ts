import axiosInstance from '@/utils/axios';
import { SpaceCardCreateResponseDTO, SpaceCardCreateRequestDTO } from '@repo/shared-types';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

async function fetchCreateSpaceCard(
  spaceId: string,
  data: {
    targetCardId: string;
    x: number;
    y: number;
  },
) {
  return await axiosInstance.post<SpaceCardCreateResponseDTO>(
    `/space/${spaceId}/space-card`,
    data,
  );
}

function useCreateSpaceCard(): UseMutationResult<AxiosResponse<SpaceCardCreateResponseDTO>, unknown, SpaceCardCreateRequestDTO & {
  spaceId: string;
}, unknown> {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: (data: SpaceCardCreateRequestDTO & {
      spaceId: string;
    }) => fetchCreateSpaceCard(data.spaceId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['space', data.data.spaceCard.targetSpaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ['spaces'],
      });
    },
  });
  return mutate;
}

export default useCreateSpaceCard;
