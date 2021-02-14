import { Polyomino } from '../polyomino';

export class PurpleT extends Polyomino {
  getColor(): string {
    return 'purple';
  }

  getUp(): boolean[][] {
    return [
      [true, true, true],
      [false, true, false],
    ];
  }

  getRight(): boolean[][] {
    return [
      [false, true],
      [true, true],
      [false, true],
    ];
  }

  getDown(): boolean[][] {
    return [
      [false, true, false],
      [true, true, true],
    ];
  }

  getLeft(): boolean[][] {
    return [
      [true, false],
      [true, true],
      [true, false],
    ];
  }
}
