import axiosInstance from "@/utils/axios";
import { AccountMeResponseDTO } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";

async function fetchMe() {
  return await axiosInstance.get<AccountMeResponseDTO>("/account/me");
}

function useMe() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["account", "me"],
    queryFn: () => fetchMe(),
  });
  const account = data?.data;
  return { account, isLoading, error };
}

export default useMe;
