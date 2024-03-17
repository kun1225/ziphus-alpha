import Header from "@/components/header";
import dynamic from "next/dynamic";

const CardEditor = dynamic(() => import("@/components/card/card-editor"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
 
export default function Page(): JSX.Element {
  return (
    <div className="min-w-screen h-full min-h-screen w-full bg-[#0E0E0E]">
      <Header />
      <main className=" container mx-auto py-4">
        <CardEditor />
      </main>
    </div>
  );
}
