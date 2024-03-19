import CardHeaderBar from "@/components/card/card-header-bar";
import CardSidebar from "@/components/card/card-sidebar";
import dynamic from "next/dynamic";

const CardEditor = dynamic(() => import("@/components/card/card-editor"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Page(): JSX.Element {
  return (
    <div
      className="min-w-screen grid h-full min-h-screen w-full overflow-hidden bg-[#0E0E0E]"
      style={{
        gridTemplate: `
        "side head " 2rem
        "side main" 1fr 
       / 16rem 1fr`,
      }}
    >
      <CardHeaderBar />
      <CardSidebar />
      <main style={{ gridArea: "main" }} className=" container mx-auto p-4">
        <CardEditor />
      </main>
    </div>
  );
}
