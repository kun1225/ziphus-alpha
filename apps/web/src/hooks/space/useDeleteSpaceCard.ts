import axiosInstance from '@/utils/axios';
import { SpaceDto } from '@repo/shared-types';
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import useSocket from '../useSocket';
import { useEffect } from 'react';

async function fetchDeleteSpaceCard(spaceId: string, spaceCardId: string) {
  return await axiosInstance.delete(
    `/space/${spaceId}/space-card/${spaceCardId}`,
  );
}

function useDeleteSpaceCard(
  setLocalSpace: React.Dispatch<React.SetStateAction<SpaceDto>>,
  localSpace: SpaceDto,
): UseMutationResult<
  AxiosResponse<void>,
  unknown,
  { spaceId: string; spaceCardId: string },
  unknown
> {
  const { socket } = useSocket(localSpace?.id);
  const queryClient = useQueryClient();
  const removeSpaceCard = async (spaceCardId: string) => {
    queryClient.invalidateQueries({
      queryKey: ['space', localSpace?.id],
    });
    queryClient.invalidateQueries({
      queryKey: ['spaces'],
    });
    if (setLocalSpace && localSpace) {
      setLocalSpace({
        ...localSpace,
        spaceCards: localSpace.spaceCards.filter(
          (spaceCard) => spaceCard.id !== spaceCardId,
        ),
      });
    }
  };

  const mutate = useMutation({
    mutationKey: ['space', localSpace?.id, 'delete'],
    mutationFn: ({
      spaceId,
      spaceCardId,
    }: {
      spaceId: string;
      spaceCardId: string;
    }) => fetchDeleteSpaceCard(spaceId, spaceCardId),
  });

  useEffect(() => {
    socket?.on('space:card:delete', (data: { spaceCardId: string }) => {
      removeSpaceCard(data.spaceCardId);
    });

    return () => {
      socket?.off('space:card:delete');
    };
  }, [localSpace?.id, localSpace?.spaceCards]);
  return mutate;
}

export default useDeleteSpaceCard;
