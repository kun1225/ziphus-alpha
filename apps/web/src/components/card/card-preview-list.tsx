'use client';
import CardPreviewCard from './card-preview-card';
import useQueryCardList from '@/hooks/card/useQueryCardList';

function CardPreviewList() {
  const { cards } = useQueryCardList();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <CardPreviewCard key={card.id} card={card} />
      ))}
    </div>
  );
}

export default CardPreviewList;
