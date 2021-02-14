import { Polyomino } from '../polyomino';

export class CyanI extends Polyomino {
  getColor(): string {
    return 'cyan';
  }

  getUp(): boolean[][] {
    return [
      [true],
      [true],
      [true],
      [true],
    ];
  }

  getRight(): boolean[][] {
    return [
      [true, true, true, true],
    ];
  }

  getDown(): boolean[][] {
    return [
      [true],
      [true],
      [true],
      [true],
    ];
  }

  getLeft(): boolean[][] {
    return [
      [true, true, true, true],
    ];
  }
}
