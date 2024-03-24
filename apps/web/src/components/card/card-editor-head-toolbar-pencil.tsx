import { cn } from "@/utils/cn";
import { PencilInfo } from "./card-editor";

const pencilWidths = [2, 4, 6];
const pencilColors = ["black", "red", "blue", "green", "yellow"];

interface CardEditorHeadToolbarPencilProps {
  pencilInfo: PencilInfo;
  setPencilInfo: (info: PencilInfo) => void;
}
function CardEditorHeadToolbarPencil({
  pencilInfo,
  setPencilInfo,
}: CardEditorHeadToolbarPencilProps) {
  return (
    <div className="flex items-center gap-2">
      {pencilWidths.map((width) => (
        <button
          key={width}
          className={cn(
            "h-6 rounded-full border",
            pencilInfo.pencilSize === width
              ? "border-gray-200"
              : "border-transparent",
          )}
          style={{
            width: `${width}rem`,
            backgroundColor:
              pencilInfo.pencilSize === width ? pencilInfo.pencilColor : "gray",
          }}
          onClick={() =>
            setPencilInfo({
              pencilColor: pencilInfo.pencilColor,
              pencilSize: width,
            })
          }
        />
      ))}
      {pencilColors.map((color) => (
        <button
          key={color}
          className={`h-6 w-6 rounded-full border border-gray-200 ${
            pencilInfo.pencilColor === color
              ? "border-gray-900"
              : "border-transparent"
          }`}
          style={{
            backgroundColor: color,
          }}
          onClick={() =>
            setPencilInfo({
              pencilColor: color,
              pencilSize: pencilInfo.pencilSize,
            })
          }
        />
      ))}
    </div>
  );
}

export default CardEditorHeadToolbarPencil;
