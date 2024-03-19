"use client";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import useMe from "@/hooks/useMe";
import useQueryCardById from "@/hooks/card/useQueryCardById";
import { useState } from "react";
import { Tab, Tabs, TabsHeader } from "../material-tailwind";
import CardEditorSketchPanel from "./card-editor-sketch-panel";

const CardEditorMarkdownEditor = dynamic(
  () => import("@/components/card/card-editor-markdown-editor"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
);

type Mode = "text" | "sketch";

function CardEditor() {
  const { id } = useParams();
  const { card, isLoading, error } = useQueryCardById(id as string);
  const { account } = useMe();
  const modes: Mode[] = ["text", "sketch"];
  const [activeMode, setActiveModel] = useState<Mode>("text");

  if (!card || !account) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="w-64">
        <Tabs value={activeMode}>
          <TabsHeader
            className="bg-gray-900"
            indicatorProps={{
              className: "bg-gray-100/10 shadow-none !text-gray-900",
            }}
          >
            {modes.map((value) => (
              <Tab
                key={value}
                value={value}
                onClick={() => setActiveModel(value)}
                className={
                  activeMode === value ? "text-gray-100" : "text-gray-400"
                }
              >
                {value}
              </Tab>
            ))}
          </TabsHeader>
        </Tabs>
      </div>

      <div
        className="w-[1280px] relative overflow-hidden"
        style={{
          height: card.height,
        }}
      >
        <CardEditorSketchPanel
          isSketching={activeMode === "sketch"}
          cardId={id as string}
          accountName={account.name}
        />
        <CardEditorMarkdownEditor
          cardId={id as string}
          accountName={account.name}
        />
      </div>
    </div>
  );
}

export default CardEditor;
