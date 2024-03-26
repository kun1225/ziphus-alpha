import Sidebar from "@/components/sidebar";
import SpaceHeaderBar from "@/components/space/space-header-bar";
import SpaceEditor from "@/components/space/space-editor";

export default function Page(): JSX.Element {
  return (
    <div className="min-w-screen flex h-full min-h-screen w-full overflow-hidden bg-[#0E0E0E]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <SpaceHeaderBar />
        <main className="h-full w-full">
          <SpaceEditor />
        </main>
      </div>
    </div>
  );
}
