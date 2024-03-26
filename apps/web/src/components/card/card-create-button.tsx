'use client';
import { Button, ButtonProps } from '@/components/material-tailwind';
import useCreateCard from '@/hooks/card/useCreateCard';
import { useRouter } from 'next/navigation';

interface CardCreateButtonProps extends ButtonProps {
  ref?: React.Ref<HTMLButtonElement>;
}
export function CardCreateButton({
  children,
  ...props
}: CardCreateButtonProps) {
  const router = useRouter();
  const mutate = useCreateCard();

  return (
    <Button
      variant="outlined"
      {...props}
      onClick={() =>
        mutate.mutate(undefined, {
          onSuccess: (data) => {
            router.push(`/card/${data.data.card.id}`);
          },
        })
      }
    >
      {children || 'Create'}
    </Button>
  );
}
