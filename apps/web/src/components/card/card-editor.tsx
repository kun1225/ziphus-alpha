"use client";
import useQueryCardById from "@/hooks/card/use-query-card-by-id";
import { useParams } from "next/navigation";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import useSocket from "@/hooks/useSocket";
import { Authorization, CardContentModifyEventDTO } from "@repo/shared-types";
import {
  applyContentModifyEvent,
  getSimplifyStringDiff,
} from "@repo/shared-utils";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";

const CardEditorMarkdownEditor = dynamic(
  () => import("@/components/card/card-editor-markdown-editor"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
);

function CardEditor() {
  const { id } = useParams();
  const { card: initialCard } = useQueryCardById(id as string);
  const [card, setCard] = useState(initialCard);
  const isJoinRoomRef = useRef(false);
  const socket = useSocket();

  // 初始化卡片
  useEffect(() => {
    setCard(initialCard);
  }, [initialCard]);

  // 加入卡片房間
  useEffect(() => {
    if (!initialCard) return;
    if (isJoinRoomRef.current) return;
    socket.emit("card-join", { cardId: id });
    isJoinRoomRef.current = true;

    return () => {
      socket.emit("card-leave", { cardId: id });
    };
  }, [initialCard]);

  // 監聽卡片內容修改事件
  useEffect(() => {
    if (!card) return;
    const handler = async (data: CardContentModifyEventDTO) => {
      console.log("card:modify-content", data);
      if (data.cardId !== card.id) {
        return;
      }
      if (data.socketId === socket.id) {
        return;
      }
      const updatedContent = applyContentModifyEvent(card.content, data);
      setCard({ ...card, content: updatedContent });
    };
    socket.on("card:modify-content", handler);
    return () => {
      socket.off("card:modify-content", handler);
    };
  }, [card]);

  // 卡片內容修改事件
  async function handleChange(value: string) {
    if (value === card?.content) return;
    if (!card) return;
    const contentModifyEvent = getSimplifyStringDiff(card.content, value);

    socket.emit("card:modify-content", {
      authorization: getCookie("authorization"),
      socketId: socket.id,
      cardId: card.id,
      ...contentModifyEvent,
    } as CardContentModifyEventDTO & Authorization);

    setCard({ ...card, content: value });
  }

  if (!card) return null;

  return (
    <div className="w-full">
      <CardEditorMarkdownEditor value={card.content} onChange={handleChange} />
    </div>
  );
}

export default CardEditor;
