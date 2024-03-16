"use client";
import useQueryCardById from "@/hooks/card/use-query-card-by-id";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

  if (!card) return null;

  return (
    <div className="w-full">
      <textarea
        className="w-full p-4 bg-gray-800 text-white h-screen"
        value={card?.content ?? ""}
        onChange={(e) => setCard({ ...card, content: e.target.value })}
      ></textarea>
    </div>
  );
}

export default CardEditor;
