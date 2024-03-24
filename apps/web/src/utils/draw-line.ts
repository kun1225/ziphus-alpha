import Line from "@/models/line";

const drawLine = (context: CanvasRenderingContext2D, line: Line) => {
  context.beginPath();
  context.strokeStyle = line.color;
  context.lineWidth = line.width;
  context.moveTo(line.startX, line.startY);
  context.lineTo(line.endX, line.endY);
  context.stroke();
};

export { drawLine };
