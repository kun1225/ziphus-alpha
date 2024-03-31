import axiosInstance from "@/utils/axios";
import { SpaceGetByIdWithCardResponseDTO } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";

export async function fetchSpaceByIdWithCard(spaceId: string) {
  return await axiosInstance.get<SpaceGetByIdWithCardResponseDTO>(
    `/space/${spaceId}/with-card`,
  );
}

function useQuerySpaceByIdWithCard(spaceId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["space", spaceId, "with-card"],
    queryFn: () => fetchSpaceByIdWithCard(spaceId),
  });
  const space = data?.data.space ?? null;
  return { space, isLoading, error };
}

export default useQuerySpaceByIdWithCard;
