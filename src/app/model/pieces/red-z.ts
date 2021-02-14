import { Polyomino } from '../polyomino';

export class RedZ extends Polyomino {
  getColor(): string {
    return 'red';
  }

  getUp(): boolean[][] {
    return [
      [true, true, false],
      [false, true, true],
    ];
  }

  getRight(): boolean[][] {
    return [
      [false, true],
      [true, true],
      [true, false],
    ];
  }

  getDown(): boolean[][] {
    return [
      [true, true, false],
      [false, true, true],
    ];
  }

  getLeft(): boolean[][] {
    return [
      [false, true],
      [true, true],
      [true, false],
    ];
  }
}
