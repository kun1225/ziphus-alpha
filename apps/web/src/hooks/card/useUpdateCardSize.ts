import axiosInstance from '@/utils/axios';
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useEffect } from 'react';
import { toast } from 'sonner';
import useSocket from '../useSocket';
import { CardGetByIdResponseDTO } from '@repo/shared-types';

interface UpdateCardSizeData {
  width?: number;
  height?: number;
}

async function fetchUpdateCardSize(cardId: string, data: UpdateCardSizeData) {
  return await axiosInstance.put(`/card/${cardId}/size`, data);
}

function useUpdateCardSize(
  card: CardGetByIdResponseDTO['card'],
  setCard: (card: CardGetByIdResponseDTO['card']) => void,
): UseMutationResult<AxiosResponse<void>, unknown, UpdateCardSizeData, unknown> {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateCardSizeData) => {
      setCard({
        ...card!,
        width: data.width || card!.width,
        height: data.height || card!.height,
      });
      return fetchUpdateCardSize(
        card!.id,
        {
          width: data.width,
          height: data.height,
        }
      );
    },
    onError: (error) => {
      toast.error(JSON.stringify(error.message));
    },
  });


  useEffect(() => {
    if (!card) return;
    socket.on(
      `card:${card.id}:size-modified`,
      (data: {
        width: number,
        height: number,
      }) => {
        setCard({
          ...card,
          width: data.width || card.width,
          height: data.height || card.height,
        });
        queryClient.invalidateQueries({ queryKey: ['cards', card.id] });
        queryClient.invalidateQueries({ queryKey: ['cards'] });
      },
    );

    return () => {
      socket.off(`card:${card.id}:size-modified`);
    };
  }, [card]);

  return mutation;
}

export default useUpdateCardSize;
