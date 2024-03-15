import CardEditor from "@/components/card/card-editor";
import Header from "@/components/header";

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

