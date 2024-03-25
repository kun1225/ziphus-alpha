export default class Line {
  constructor(
    readonly strokeId: string,
    readonly color: string,
    readonly width: number,
    readonly startX: number,
    readonly startY: number,
    readonly endX: number,
    readonly endY: number,
  ) { }
}
