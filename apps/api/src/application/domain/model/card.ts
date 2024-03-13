export enum CardPermission {
  Private = "Private",
  PublicReadOnly = "PublicReadOnly",
  PublicEditable = "PublicEditable",
}

export class Stroke {
  constructor(
    readonly id: string,
    readonly lines: Line[]
  ) {}
}

export class Line {
  constructor(
    readonly strokeId: string,
    readonly color: string,
    readonly width: number,
    readonly startX: number,
    readonly startY: number,
    readonly endX: number,
    readonly endY: number
  ) {}
}

export class Illustration {
  constructor(
    readonly id: string,
    readonly image: string,
    readonly width: number,
    readonly height: number,
    readonly positionX: string,
    readonly positionY: string
  ) {}
}

class Card {
  constructor(
    readonly id: string,
    readonly belongAccountId: string,
    readonly permission: CardPermission,
    readonly content: string,
    readonly width: number,
    readonly height: number,
    readonly illustrations: Illustration[],
    readonly createdAt: string,
    readonly updatedAt: string,
    readonly deletedAt: string | null
  ) {}
}

export default Card;
