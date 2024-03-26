"use client";
import { Button, ButtonProps } from "@/components/material-tailwind";
import useCreateSpace from "@/hooks/space/useCreateSpace";
import { useRouter } from "next/navigation";

interface SpaceCreateButtonProps extends ButtonProps {
  ref?: React.Ref<HTMLButtonElement>;
}
export function SpaceCreateButton({
  children,
  ...props
}: SpaceCreateButtonProps) {
  const mutate = useCreateSpace();
  const router = useRouter();
  return (
    <Button
      variant="outlined"
      {...props}
      onClick={() =>
        mutate.mutate(undefined, {
          onSuccess: (data) => {
            router.push(`/space/${data.data.space.id}`);
          },
        })
      }
    >
      {children || "Create"}
    </Button>
  );
}
