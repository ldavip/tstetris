import { Polyomino } from '../polyomino';

export class OrangeL extends Polyomino {
  getColor(): string {
    return 'orange';
  }

  getUp(): boolean[][] {
    return [
      [true, false],
      [true, false],
      [true, true],
    ];
  }

  getRight(): boolean[][] {
    return [
      [true, true, true],
      [true, false, false],
    ];
  }

  getDown(): boolean[][] {
    return [
      [true, true],
      [false, true],
      [false, true],
    ];
  }

  getLeft(): boolean[][] {
    return [
      [false, false, true],
      [true, true, true],
    ];
  }
}
