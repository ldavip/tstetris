import { Polyomino } from '../polyomino';

export class GrayBlock extends Polyomino {
  getColor(): string {
    return 'gray';
  }

  getUp(): boolean[][] {
    return [[true]];
  }

  getRight(): boolean[][] {
    return [[true]];
  }

  getDown(): boolean[][] {
    return [[true]];
  }

  getLeft(): boolean[][] {
    return [[true]];
  }
}
