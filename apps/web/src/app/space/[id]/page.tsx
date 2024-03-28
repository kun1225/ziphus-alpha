import Sidebar from "@/components/sidebar";
import SpaceHeaderBar from "@/components/space/space-header-bar";
import SpaceEditor from "@/components/space/space-editor";
import { cookies } from "next/headers";
import { fetchSpaceById } from "@/hooks/space/useQuerySpaceById";
import axiosInstance from "@/utils/axios";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const cookieStore = cookies();
  const authorization = cookieStore.get("authorization");
  axiosInstance.defaults.headers.authorization = authorization?.value ?? "";
  const data = await fetchSpaceById(id);

  if (!data?.data?.space) {
    return <div>Space not found</div>;
  }
  return (
    <div className="min-w-screen flex h-full min-h-screen w-full overflow-hidden bg-[#0E0E0E]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <SpaceHeaderBar />
        <main className="h-full w-full">
          <SpaceEditor initialSpace={data.data.space} />
        </main>
      </div>
    </div>
  );
}
