import axiosInstance from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetchUpdateSpaceTitle(spaceId: string, title: string) {
  return await axiosInstance.put(`/space/${spaceId}/title`, {
    title,
  });
}

function useUpdateSpaceTitle(spaceId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (title: string) => fetchUpdateSpaceTitle(spaceId, title),
    onSuccess: (_, title) => {
      queryClient.setQueryData(["spaces", spaceId], (data: any) => {
        return {
          ...data,
          title,
        };
      });
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
    onError: (error) => {
      toast.error(JSON.stringify(error.message));
    },
  });

  return mutation;
}

export default useUpdateSpaceTitle;
