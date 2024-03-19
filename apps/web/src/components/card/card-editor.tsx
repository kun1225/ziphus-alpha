'use client';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import useMe from '@/hooks/useMe';
import useQueryCardById from '@/hooks/card/useQueryCardById';
import { Input } from '@/components/material-tailwind';

const CardEditorMarkdownEditor = dynamic(
  () => import('@/components/card/card-editor-markdown-editor'),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
);

function CardEditor() {
  const { id } = useParams();
  const { card, isLoading, error } = useQueryCardById(id as string);
  const { account } = useMe();


  if (!card || !account) return null;

  return (
    <div className="w-full">
      <CardEditorMarkdownEditor
        cardId={id as string}
        accountName={account.name}
      />
    </div>
  );
}

export default CardEditor;
