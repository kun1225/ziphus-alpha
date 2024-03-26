import axiosInstance from '@/utils/axios';
import { SpaceCardCreateResponseDTO } from '@repo/shared-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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

function useCreateSpaceCard(): any {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: (data: {
      spaceId: string;
      targetCardId: string;
      x: number;
      y: number;
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
