import { Polyomino } from '../polyomino';

export class YellowO extends Polyomino {
  getColor(): string {
    return 'yellow';
  }

  getUp(): boolean[][] {
    return [
      [true, true],
      [true, true],
    ];
  }

  getRight(): boolean[][] {
    return [
      [true, true],
      [true, true],
    ];
  }

  getDown(): boolean[][] {
    return [
      [true, true],
      [true, true],
    ];
  }

  getLeft(): boolean[][] {
    return [
      [true, true],
      [true, true],
    ];
  }
}
