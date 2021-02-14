import { Direction, DirectionEnum } from './direction';

export abstract class Polyomino {
  direction = Direction.UP;

  abstract getColor(): string;

  abstract getUp(): boolean[][];

  abstract getRight(): boolean[][];

  abstract getDown(): boolean[][];

  abstract getLeft(): boolean[][];

  get shape(): boolean[][] {
    switch (this.direction.value) {
      case DirectionEnum.UP:
        return this.getUp();
      case DirectionEnum.RIGHT:
        return this.getRight();
      case DirectionEnum.DOWN:
        return this.getDown();
      case DirectionEnum.LEFT:
        return this.getLeft();
    }
  }
}
