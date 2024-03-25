export class SpaceCard {
  constructor(
    readonly id: string,
    readonly targetCardId: string,
    readonly targetSpaceId: string,
    readonly x: number,
    readonly y: number,
  ) { }
}

export class ChildSpace {
  constructor(
    readonly id: string,
    readonly targetSpaceId: string,
    readonly x: number,
    readonly y: number,
  ) { }
}

class Space {
  constructor(
    readonly id: string,
    readonly belongAccountId: string,
    readonly title: string,
    readonly content: string,
    readonly spaceCards: SpaceCard[],
    readonly childSpaces: ChildSpace[],
    readonly createdAt: string,
    readonly updatedAt: string,
    readonly deletedAt: string | null
  ) { }
}

export default Space;
