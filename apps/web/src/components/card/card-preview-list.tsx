"use client";
import { useQuery } from "@tanstack/react-query";
import CardPreviewCard from "./card-preview-card";
import { CardGetWithAllResponseDTO } from "@repo/shared-types";
import axios from "@/utils/axios";
import { getCookie } from "cookies-next";

async function fetchCardWithAll() {
  return await axios.get<CardGetWithAllResponseDTO>("/card/get-with-all");
}

function CardPreviewList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["card", "get-with-all"],
    queryFn: fetchCardWithAll,
  });
  const cards = data?.data.cards ?? [];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <CardPreviewCard key={card.id} card={card} />
      ))}
    </div>
  );
}

export default CardPreviewList;
