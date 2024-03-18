'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from '@/utils/axios';
import { CardStartEditSingleCardResponseDTO } from '@repo/shared-types';

const CardEditorMarkdownEditor = dynamic(
  () => import('@/components/card/card-editor-markdown-editor'),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
);


async function fetchCardStartEdit(cardId: string) {
  return await axios.post<CardStartEditSingleCardResponseDTO>('/card/start-edit-single-card',
    {
      id: cardId,
    });
}


function CardEditor() {
  const { id } = useParams();
  const [card, setCard] = useState<CardStartEditSingleCardResponseDTO['card'] | null>();
  // 初始化卡片
  useEffect(() => {
    const isLoad = async () => {
      const result = await fetchCardStartEdit(id as string);
      setCard(result.data.card);
    };
    isLoad();
  }, []);

  if (!card) return null;

  return (
    <div className="w-full">
      <CardEditorMarkdownEditor
        cardId={card.id}
      />
    </div>
  );
}

export default CardEditor;
