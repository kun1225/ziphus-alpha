import Sidebar from '@/components/sidebar';
import SpaceHeaderBar from '@/components/space/space-header-bar';
import { cookies } from 'next/headers';
import { fetchSpaceByIdWithCard } from '@/hooks/space/useQuerySpaceByIdWithCard';
import axiosInstance from '@/utils/axios';
import { Metadata } from 'next';
import { SpaceGetByIdWithCardResponseDTO } from '@repo/shared-types';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
const SpaceEditor = dynamic(() => import('@/components/space/space-editor'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export const metadata: Metadata = {};

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const cookieStore = cookies();
  const authorization = cookieStore.get('authorization');
  axiosInstance.defaults.headers.authorization = authorization?.value ?? '';

  let data: SpaceGetByIdWithCardResponseDTO | null = null;
  try {
    data = (await fetchSpaceByIdWithCard(id)).data;
  } catch (error) {
    console.error(error);
    redirect('/login');
  }

  const title = data?.space?.title ?? 'Ziphus Space Editor';
  const description =
    data?.space?.spaceCards
      .map((card) => card?.card?.content ?? '')
      .join('')
      .substring(0, 157) ?? 'Ziphus';

  metadata.title = `Ziphus - ${title}`;
  metadata.description = description;

  metadata.openGraph = {
    title,
    description,
    type: 'website',
    url: `https://ziphus.com/space/${id}`,
  };

  metadata.twitter = {
    card: 'summary',
    site: '@ziphus',
    title,
    description,
  };

  if (!data?.space) {
    return <div>Space not found</div>;
  }
  return (
    <div className="min-w-screen flex h-full min-h-screen w-full overflow-hidden bg-[#0E0E0E]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <SpaceHeaderBar />
        <main className="h-full w-full">
          <SpaceEditor initialSpace={data.space} />
        </main>
      </div>
    </div>
  );
}
