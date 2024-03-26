import axiosInstance from "@/utils/axios";
import { SpaceCardCreateResponseDTO } from "@repo/shared-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

function useCreateSpaceCard() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutate = useMutation({
    mutationFn: (data: {
      spaceId: string;
      targetCardId: string;
      x: number;
      y: number;
    }) => fetchCreateSpaceCard(data.spaceId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["space", data.data.spaceCard.targetSpaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["spaces"],
      });
      toast.success("Space Card created successfully");
    },
  });
  return mutate;
}

export default useCreateSpaceCard;
