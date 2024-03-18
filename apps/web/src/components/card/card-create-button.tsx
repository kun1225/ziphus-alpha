"use client";
import { Button, ButtonProps } from "@/components/material-tailwind";
import axiosInstance from "@/utils/axios";
import { CardCreateResponseDTO } from "@repo/shared-types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

async function fetchCardWithAll() {
  return await axiosInstance.post<CardCreateResponseDTO>("/card");
}

interface CardCreateButtonProps extends ButtonProps {
  ref?: React.Ref<HTMLButtonElement>;
}
export function CardCreateButton({
  children,
  ...props
}: CardCreateButtonProps) {
  const router = useRouter();
  const handleClick = async () => {
    const response = await fetchCardWithAll();
    toast.success("Card created successfully");
    router.push(`/card/${response.data.card.id}`);
  };
  return (
    <Button variant="outlined" {...props} onClick={handleClick}>
      {children || "Create"}
    </Button>
  );
}
