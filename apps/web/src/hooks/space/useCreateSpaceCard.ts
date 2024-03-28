import axiosInstance from '@/utils/axios';
import {
  SpaceCardCreateResponseDTO,
  SpaceCardCreateRequestDTO,
  SpaceGetByIdResponseDTO,
} from '@repo/shared-types';
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import useSocket from '../useSocket';
import { useEffect } from 'react';

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

function useCreateSpaceCard(
  setLocalSpace: React.Dispatch<
    React.SetStateAction<SpaceGetByIdResponseDTO['space']>
  >,
  localSpace: SpaceGetByIdResponseDTO['space'],
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
      queryKey: ['space', localSpace?.id],
    });
    queryClient.invalidateQueries({
      queryKey: ['spaces'],
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
      },
    ) => fetchCreateSpaceCard(data.spaceId, data),
    onSuccess: (data) => {},
  });

  useEffect(() => {
    socket.on('space:card:create', (data: SpaceCardCreateResponseDTO) => {
      console.log('space:card:create', data);
      createSpaceCard(data);
    });

    return () => {
      socket.off('space:card:create');
    };
  }, [localSpace?.id, localSpace?.spaceCards]);
  return mutate;
}

export default useCreateSpaceCard;
