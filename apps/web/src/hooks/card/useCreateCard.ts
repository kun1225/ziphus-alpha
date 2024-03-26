import axiosInstance from "@/utils/axios";
import { CardCreateResponseDTO } from "@repo/shared-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetchCreateCard() {
  return await axiosInstance.post<CardCreateResponseDTO>("/card");
}

function useCreateCard() {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: fetchCreateCard,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["cards"],
      });
      toast.success("Card created successfully");
    },
  });
  return mutate;
}

export default useCreateCard;
