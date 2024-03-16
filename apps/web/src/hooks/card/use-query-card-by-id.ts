import axios from "@/utils/axios";
import { CardGetByIdResponseDTO } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";

async function fetchCardById(cardId: string) {
  return await axios.get<CardGetByIdResponseDTO>("/card/get-by-id", {
    params: {
      id: cardId,
    },
  });
}

function useQueryCardById(cardId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["card", "get-by-id", cardId],
    queryFn: () => fetchCardById(cardId),
  });
  const card = data?.data.card ?? null;
  return { card, isLoading, error };
}

export default useQueryCardById;
