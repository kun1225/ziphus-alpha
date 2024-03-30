import { cn } from '@/utils/cn';
import { PencilInfo } from '@/components/card/card-editor-sketch-panel';

const pencilWidths = [4, 8, 12];
const pencilColors = ['black', 'red', 'blue', 'green', 'yellow'];

interface SpaceToolbarPencilProps {
  pencilInfo: PencilInfo;
  setPencilInfo: (info: PencilInfo) => void;
}
function SpaceToolbarPencil({
  pencilInfo,
  setPencilInfo,
}: SpaceToolbarPencilProps) {
  return (
    <div className="w-12 flex flex-col items-center absolute right-16 top-1/2 -translate-y-1/2 z-50 gap-2">
      {pencilWidths.map((width, index) => (
        <button
          key={width}
          className={cn(
            'h-6 rounded-full border',
            pencilInfo.pencilSize === width
              ? 'border-gray-200'
              : 'border-transparent',
          )}
          style={{
            width: `${16 + 4 * index}px`,
            height: `${16 + 4 * index}px`,
            backgroundColor:
              pencilInfo.pencilSize === width ? pencilInfo.pencilColor : 'gray',
          }}
          onClick={(event) => {
            event.stopPropagation();
            setPencilInfo({
              pencilColor: pencilInfo.pencilColor,
              pencilSize: width,
            });
          }}
        />
      ))}
      {pencilColors.map((color) => (
        <button
          key={color}
          className={`h-6 w-6 rounded-full border border-gray-200 ${pencilInfo.pencilColor === color
            ? 'border-gray-900'
            : 'border-transparent'
            }`}
          style={{
            backgroundColor: color,
          }}
          onClick={(event) => {
            event.stopPropagation();
            setPencilInfo({
              pencilColor: color,
              pencilSize: pencilInfo.pencilSize,
            });
          }}
        />
      ))}
    </div>
  );
}

export default SpaceToolbarPencil;
