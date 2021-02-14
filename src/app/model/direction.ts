export enum DirectionEnum {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

export class Direction {
  public static readonly UP = new Direction(DirectionEnum.UP);
  public static readonly RIGHT = new Direction(DirectionEnum.RIGHT);
  public static readonly DOWN = new Direction(DirectionEnum.DOWN);
  public static readonly LEFT = new Direction(DirectionEnum.LEFT);

  value: DirectionEnum;

  constructor(value: DirectionEnum) {
    this.value = value;
  }

  get nextClockwise(): Direction {
    switch (this.value) {
      case DirectionEnum.UP:
        return Direction.RIGHT;
      case DirectionEnum.RIGHT:
        return Direction.DOWN;
      case DirectionEnum.DOWN:
        return Direction.LEFT;
      case DirectionEnum.LEFT:
        return Direction.UP;
    }
  }

  get nextAntiClockwise(): Direction {
    switch (this.value) {
      case DirectionEnum.UP:
        return Direction.LEFT;
      case DirectionEnum.LEFT:
        return Direction.DOWN;
      case DirectionEnum.DOWN:
        return Direction.RIGHT;
      case DirectionEnum.RIGHT:
        return Direction.UP;
    }
  }
}
