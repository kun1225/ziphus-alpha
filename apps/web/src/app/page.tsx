import Header from '@/components/header';
import Link from 'next/link';

export default function Page(): JSX.Element {
  return (
    <div className="min-w-screen h-full min-h-screen w-full bg-[#0E0E0E]">
      <Header />
      <main className=" container mx-auto py-4 flex flex-col">
        <Link href="/spaces" className="text-white">Space List</Link>
        <Link href="/cards" className="text-white">Card List</Link>
      </main>
    </div>
  );
}
