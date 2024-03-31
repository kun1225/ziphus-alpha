'use client';
import { useParams } from 'next/navigation';
import useMe from '@/hooks/useMe';
import CardEditorSketchPanel from './card-editor-sketch-panel';
import CardEditorMarkdownEditor from './card-editor-markdown-editor';
import useYJSProvide from '@/hooks/useYJSProvider';
import CardEditorHeadToolbar from './card-editor-head-toolbar';
import useCardEditor from '@/hooks/card/useCardEditor';
import useUpdateCardSize from '@/hooks/card/useUpdateCardSize';

function CardEditor() {
  const { id } = useParams();
  const {
    card,
    setCard,
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
  } = useCardEditor(id as string);
  const { account } = useMe();
  const { doc, provider, status } = useYJSProvide(`card-${id}`);

  const mutateUpdateCardSize = useUpdateCardSize(card, setCard);

  if (!card || !account || status !== 'connected') return null;

  return (
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
        <CardEditorSketchPanel
          isSketching={editMode === 'sketch'}
          cardId={id as string}
          accountName={account.name}
          doc={doc}
          sketchMode={sketchMode}
          pencilInfo={pencilInfo}
          eraserInfo={eraserInfo}
        />
        <CardEditorMarkdownEditor
          cardId={id as string}
          onCardSizeChange={(width, height) => {
            if (card.height !== height && height > 1280) {
              mutateUpdateCardSize.mutate({
                height,
              });
            } else if (card.height > 1280 && height < 1280) {
              mutateUpdateCardSize.mutate({
                height: 1280,
              });
            }
          }}
          accountName={account.name}
          provider={provider}
          doc={doc}
        />
      </div>
    </div>
  );
}

export default CardEditor;
