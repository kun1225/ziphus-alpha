import axiosInstance from '@/utils/axios';
import { SpaceGetWithAllResponseDTO } from '@repo/shared-types';
import { useQuery } from '@tanstack/react-query';

async function fetchCardList() {
  return await axiosInstance.get<SpaceGetWithAllResponseDTO>('/spaces');
}

function useQuerySpaceList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['spaces'],
    queryFn: fetchCardList,
  });
  const spaces = data?.data.spaces ?? [];

  return { spaces, isLoading, error };
}

export default useQuerySpaceList;
