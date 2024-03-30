import { cn } from '@/utils/cn';
import { EraserInfo } from '@/components/card/card-editor-sketch-panel';

const eraserWidths = [4, 16, 32, 64];

interface SpaceToolbarEraserProps {
  eraserInfo: EraserInfo;
  setEraserInfo: (info: EraserInfo) => void;
}
function SpaceToolbarEraser({
  eraserInfo,
  setEraserInfo,
}: SpaceToolbarEraserProps) {
  return (
    <div className="w-12 flex flex-col items-center absolute right-16 top-1/2 -translate-y-1/2 z-50 gap-2">
      {eraserWidths.map((width, index) => (
        <button
          key={width}
          className={cn(
            'rounded-full border',
            eraserInfo.eraserSize === width
              ? 'border-gray-200'
              : 'border-transparent',
          )}
          style={{
            width: `${16 + 4 * index}px`,
            height: `${16 + 4 * index}px`,
            backgroundColor: eraserInfo.eraserSize === width ? 'gray' : 'white',
          }}
          onClick={(event) => {
            event.stopPropagation();
            setEraserInfo({
              eraserSize: width,
            });
          }}
        />
      ))}
    </div>
  );
}

export default SpaceToolbarEraser;
