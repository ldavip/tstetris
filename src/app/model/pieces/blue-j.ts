import { Polyomino } from '../polyomino';

export class BlueJ extends Polyomino {
  getColor(): string {
    return 'blue';
  }

  getUp(): boolean[][] {
    return [
      [false, true],
      [false, true],
      [true, true],
    ];
  }

  getRight(): boolean[][] {
    return [
      [true, false, false],
      [true, true, true],
    ];
  }

  getDown(): boolean[][] {
    return [
      [true, true],
      [true, false],
      [true, false],
    ];
  }

  getLeft(): boolean[][] {
    return [
      [true, true, true],
      [false, false, true],
    ];
  }
}
