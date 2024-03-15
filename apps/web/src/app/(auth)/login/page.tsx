import { Button } from '@/components/material-tailwind';

export default function Page(): JSX.Element {
  return (
    <h1 className="text-3xl font-bold underline">
      <Button variant="outlined">outlined</Button>
    </h1>
  );
}
