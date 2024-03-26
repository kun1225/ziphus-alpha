import Line from './line';

export default class Stroke {
  constructor(
    readonly id: string,
    readonly lines: Line[],
  ) {}
}
