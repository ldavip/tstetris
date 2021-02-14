import { Polyomino } from '../polyomino';

export class GreenS extends Polyomino {
  getColor(): string {
    return 'green';
  }

  getUp(): boolean[][] {
    return [
      [false, true, true],
      [true, true, false],
    ];
  }

  getRight(): boolean[][] {
    return [
      [true, false],
      [true, true],
      [false, true],
    ];
  }

  getDown(): boolean[][] {
    return [
      [false, true, true],
      [true, true, false],
    ];
  }

  getLeft(): boolean[][] {
    return [
      [true, false],
      [true, true],
      [false, true],
    ];
  }
}
