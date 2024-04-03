'use client';
import { useParams } from 'next/navigation';
import useMe from '@/hooks/useMe';
import CardEditorSketchPanel from './card-editor-sketch-panel';
import CardEditorMarkdownEditor from './card-editor-markdown-editor';
import useYJSProvide from '@/hooks/useYJSProvider';
import CardEditorHeadToolbar from './card-editor-head-toolbar';
import useCardEditor from '@/hooks/card/useCardEditor';
import useUpdateCardSize from '@/hooks/card/useUpdateCardSize';

const MIN_CARD_HEIGHT = 300;
const MIN_CARD_WIDTH = 300;


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
  const { doc, provider, status } = useYJSProvide(`card:${id}`);

  const mutateUpdateCardSize = useUpdateCardSize(card, setCard);

  console.log('card', card, account, status);
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
        className="relative overflow-hidden"
        style={{
          height: card.height,
          width: card.width,
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
            if (card.height !== height && height > MIN_CARD_HEIGHT) {
              mutateUpdateCardSize.mutate({
                height,
              });
            } else if (card.height > MIN_CARD_HEIGHT && height < MIN_CARD_HEIGHT) {
              mutateUpdateCardSize.mutate({
                height: MIN_CARD_HEIGHT,
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
