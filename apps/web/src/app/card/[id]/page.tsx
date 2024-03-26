import CardHeaderBar from "@/components/card/card-header-bar";
import Sidebar from "@/components/sidebar";
import dynamic from "next/dynamic";

const CardEditor = dynamic(() => import("@/components/card/card-editor"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Page(): JSX.Element {
  return (
    <div className="min-w-screen flex h-full min-h-screen w-full overflow-hidden bg-[#0E0E0E]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <CardHeaderBar />
        <main className="container mx-auto flex-1 p-4">
          <CardEditor />
        </main>
      </div>
    </div>
  );
}
