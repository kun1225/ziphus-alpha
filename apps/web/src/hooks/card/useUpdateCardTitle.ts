import axiosInstance from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetchUpdateCardTitle(cardId: string, title: string) {
  return await axiosInstance.put(`/card/${cardId}/title`, {
    title,
  });
}

function useUpdateCardTitle(cardId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (title: string) => fetchUpdateCardTitle(cardId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["card", cardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["cards"],
      });
    },
    onError: (error) => {
      toast.error(JSON.stringify(error.message));
    },
  });

  return mutation;
}

export default useUpdateCardTitle;
