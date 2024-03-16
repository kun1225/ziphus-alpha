'use client';
import useQueryCardById from '@/hooks/card/use-query-card-by-id';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import socket from '@/utils/socket';

function CardEditor() {
  const { id } = useParams();
  const {
    card: initialCard,
    isLoading,
    error,
  } = useQueryCardById(id as string);
  const [card, setCard] = useState(initialCard);

  useEffect(() => {
    setCard(initialCard);
  }, [initialCard]);

  useEffect(() => {
    if (!card) return;
    const handler = (data) => {
      if (data.id === card.id) {
        setCard(data);
      }
    };
    socket.on('card:modified', handler);
    return () => {
      socket.off('card:modified', handler);
    };
  }, [card]);

  if (!card) return null;

  return (
    <div className="w-full">
      <textarea
        className="h-screen w-full bg-gray-800 p-4 text-white"
        value={card?.content ?? ''}
        onChange={(e) => setCard({ ...card, content: e.target.value })}
      ></textarea>
    </div>
  );
}

export default CardEditor;
