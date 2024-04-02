import Header from "@/components/header";
import { Button } from "@/components/material-tailwind";
import Link from "next/link";
import dynamic from "next/dynamic";
const SpaceEditor = dynamic(() => import("@/components/space/space-editor"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const exampleSpace = {
  id: "2abe0db4-8a4f-49b6-8448-b021207d4533",
  belongAccountId: "5acce49d-2a34-4caa-a169-729af00707cf",
  title: "Ziphus 使用",
  permission: "Private",
  spaceCards: [
    {
      id: "cc7e7dac-c69a-42fb-bc2c-b78233bfbac1",
      targetCardId: "2ca28137-f6c5-4bb4-b0db-ff5b47df2293",
      targetSpaceId: "2abe0db4-8a4f-49b6-8448-b021207d4533",
      x: 5.012850609625597,
      y: 0.5134156776159715,
      card: {
        id: "2ca28137-f6c5-4bb4-b0db-ff5b47df2293",
        belongAccountId: "5acce49d-2a34-4caa-a169-729af00707cf",
        permission: "Private",
        title: "",
        content:
          '<h1 class="bn-inline-content">Ziphus 使用方法</h1><h2 class="bn-inline-content">電腦</h2><ul><li><p class="bn-inline-content">右鍵按著，移動</p></li><li><p class="bn-inline-content">左鍵拖動卡片</p></li><li><p class="bn-inline-content">左鍵點擊卡片開始編輯</p></li><li><p class="bn-inline-content"></p></li></ul><p class="bn-inline-content"></p>',
        width: 1280,
        height: 1280,
        illustrations: [],
        drawings: [],
        createdAt: "2024-03-31T17:28:38.727Z",
        updatedAt: "2024-03-31T17:28:38.727Z",
        deletedAt: null,
      },
    },
    {
      id: "54490188-b72d-46d9-ab91-5311038d1349",
      targetCardId: "f8621259-4f61-407d-8b30-4f391efad99f",
      targetSpaceId: "2abe0db4-8a4f-49b6-8448-b021207d4533",
      x: 1374.2859894937756,
      y: 197.1934620242721,
      card: {
        id: "f8621259-4f61-407d-8b30-4f391efad99f",
        belongAccountId: "5acce49d-2a34-4caa-a169-729af00707cf",
        permission: "Private",
        title: "",
        content:
          '<p class="bn-inline-content">Ｅ</p><p class="bn-inline-content"></p>',
        width: 1280,
        height: 1280,
        illustrations: [],
        drawings: [],
        createdAt: "2024-04-01T04:36:40.544Z",
        updatedAt: "2024-04-01T04:36:40.544Z",
        deletedAt: null,
      },
    },
  ],
  childSpaces: [],
  createdAt: "2024-03-30T17:13:06.030Z",
  updatedAt: "2024-03-30T17:13:06.030Z",
  deletedAt: null,
};

export default function Page(): JSX.Element {
  return (
    <div className="min-w-screen h-full min-h-screen w-full bg-[#0E0E0E] ">
      <Header />
      <main className=" container mx-auto flex flex-col items-center py-4">
        <div className="gradient absolute top-0"></div>
        <h1 className="mt-24 text-6xl font-bold text-white">
          視覺化的筆記平台
        </h1>
        <p className="z-10 mt-12 text-2xl text-white">簡單、直覺、免費</p>
        <p className="z-10 mt-2 text-2xl text-white">結合 Miro ＆ Notion</p>
        <div className="z-10">
          <Link href={"/login"}>
            <Button
              className="mt-12 text-white"
              color="white"
              size="md"
              variant="outlined"
            >
              立即開始，完全免費
            </Button>
          </Link>
        </div>
        <main className="mt-12 h-[720px] w-full overflow-hidden rounded-xl">
          <SpaceEditor initialSpace={exampleSpace as any} />
        </main>
      </main>
    </div>
  );
}
