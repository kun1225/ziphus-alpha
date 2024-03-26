'use client';
import useCardEditor from '@/hooks/card/useCardEditor';
import useMe from '@/hooks/useMe';
import { SpaceCardDTO } from '@repo/shared-types';
import { View } from './space-editor';
import { useEffect, useRef, useState } from 'react';
import CardEditorSketchPanel from '../card/card-editor-sketch-panel';
import CardEditorMarkdownEditor from '../card/card-editor-markdown-editor';
import CardEditorHeadToolbar from '../card/card-editor-head-toolbar';
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';

interface SpaceCardEditorProps {
  initialSpaceCard: SpaceCardDTO;
  doc: Y.Doc;
  socketIOProvider: SocketIOProvider;
  focusSpaceCardId: string | null;
  onFocus: () => void;
  onBlur: () => void;
}

function SpaceCardEditor({
  initialSpaceCard,
  doc,
  socketIOProvider,
  focusSpaceCardId,
  onFocus,
  onBlur,
}: SpaceCardEditorProps) {
  const { account } = useMe();
  const spaceCardRef = useRef<HTMLDivElement>(null);
  const [spaceCard, setSpaceCard] = useState<SpaceCardDTO | null>(
    initialSpaceCard,
  );
  const {
    card,
    isLoading,
    error,
    editMode,
    setEditMode,
    sketchMode,
    setSketchMode,
    pencilInfo,
    setPencilInfo,
    eraserInfo,
    setEraserInfo,
  } = useCardEditor(initialSpaceCard.targetCardId);

  useEffect(() => {
    function onBlurCard(event: MouseEvent) {
      if (
        spaceCardRef.current &&
        !spaceCardRef.current.contains(event.target as Node)
      ) {
        onBlur();
      }
    }
    document.addEventListener('click', onBlurCard);
    return () => document.removeEventListener('click', onBlurCard);
  }, [onBlur]);

  if (!card || !account) return null;

  return (
    <div
      className=" absolute h-fit w-fit border border-gray-200 bg-gray-900 shadow-md"
      style={{
        transform: `translate(${spaceCard?.x}px, ${spaceCard?.y}px)`,
      }}
      onClick={() => {
        if (focusSpaceCardId !== spaceCard?.id) {
          onFocus();
        }
      }}
      ref={spaceCardRef}
    >
      <div className="flex flex-col gap-2">
        <CardEditorHeadToolbar
          editMode={editMode}
          setEditMode={setEditMode}
          sketchMode={sketchMode}
          setSketchMode={setSketchMode}
          pencilInfo={pencilInfo}
          setPencilInfo={setPencilInfo}
          eraserInfo={eraserInfo}
          setEraserInfo={setEraserInfo}
        />
        <div
          className="relative w-[1280px] overflow-hidden"
          style={{
            height: card.height,
          }}
        >
          {/* <CardEditorSketchPanel
            isSketching={editMode === "sketch"}
            cardId={card.id as string}
            accountName={account.name}
            doc={doc}
            sketchMode={sketchMode}
            pencilInfo={pencilInfo}
            eraserInfo={eraserInfo}
          /> */}
          <CardEditorMarkdownEditor
            cardId={card.id as string}
            accountName={account.name}
            provider={socketIOProvider}
            doc={doc}
          />
        </div>
      </div>
    </div>
  );
}

export default SpaceCardEditor;
