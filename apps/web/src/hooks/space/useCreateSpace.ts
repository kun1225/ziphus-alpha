import axiosInstance from '@/utils/axios';
import { SpaceCreateResponseDTO } from '@repo/shared-types';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { toast } from 'sonner';

async function fetchCreateSpace() {
  return await axiosInstance.post<SpaceCreateResponseDTO>('/space');
}

function useCreateSpace(): UseMutationResult<AxiosResponse<SpaceCreateResponseDTO>, unknown, void, unknown> {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: fetchCreateSpace,
    onSuccess: (data) => {
      queryClient.setQueryData(['spaces'], (prev: any) => [
        ...prev,
        data.data.space,
      ]);
      toast.success('Space created successfully');
    },
  });
  return mutate;
}

export default useCreateSpace;
