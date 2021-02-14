import { Polyomino } from './polyomino';
import { Position } from './position';
import { Tetromino } from './tetromino';

export class FixedBlock extends Tetromino {
  constructor(polyomino: Polyomino, position: Position) {
    super(polyomino, position, false);
  }
}
