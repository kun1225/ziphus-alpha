import Link from "next/link";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/nextui";

export default function Page(): JSX.Element {
  return (
    <div className="min-w-screen h-full min-h-screen w-full bg-black ">
      <Header />
      <main className=" container mx-auto flex flex-col items-center py-4">
        <h1 className="mt-24 text-6xl font-bold text-white">
          視覺化的思維空間
        </h1>
        <p className="text-md z-10 mt-12 text-zinc-300">
          結合了無限空間與結構化筆記功能
        </p>
        <p className="text-md z-10 mt-2 text-zinc-300">
          卡片盒式筆記，組織你的思維
        </p>
        <p className="text-md z-10 mt-2 text-zinc-300">同步編輯、即時協作</p>
        <p className="text-md z-10 mt-2 text-zinc-400">
          請注意，這是最初期的測試版
        </p>
        <p className="text-md z-10 mt-2 text-zinc-400">
          目前只支援電腦、平板操作
        </p>
        <p className="text-md z-10 mt-2 text-zinc-400">
          且可能存在各種未知的問題，歡迎回報至
          <Link
            href="https://discord.gg/sDcyDYjr"
            className="text-blue-400 underline"
          >
            Discord
          </Link>
        </p>
        <div className="z-10">
          <Link href={"/spaces"}>
            <Button
              className="mt-12 border-white text-white"
              color="default"
              size="md"
              variant="bordered"
            >
              立即開始，完全免費
            </Button>
          </Link>
        </div>
        <main className="mt-12 h-[720px] w-full"></main>
      </main>
      <Footer />
    </div>
  );
}
