import { Block } from './block';
import { EmptyBlock } from './empty-block';
import { Polyomino } from './polyomino';
import { Position } from './position';

export class Tetromino {
  polyomino: Polyomino;
  position!: Position;
  movable = false;
  removable: boolean;
  private blocks: Array<Block[]> = [];

  constructor(polyomino: Polyomino, position?: Position, removable = true) {
    this.polyomino = polyomino;
    this.removable = removable;
    if (position) {
      this.position = position;
    }
    this.updateShape();
  }

  get color(): string {
    return this.polyomino.getColor();
  }

  get shape(): Block[][] {
    return this.blocks;
  }

  get height(): number {
    return this.shape.length;
  }

  get width(): number {
    return this.shape[0]?.length || 0;
  }

  turnClockwise() {
    if (this.movable) {
      this.polyomino.direction = this.polyomino.direction.nextClockwise;
      this.updateShape();
    }
  }

  turnAntiClockwise() {
    if (this.movable) {
      this.polyomino.direction = this.polyomino.direction.nextAntiClockwise;
      this.updateShape();
    }
  }

  updateShape() {
    const shape = this.polyomino.shape;
    this.blocks = [];
    for (let i = 0; i < shape.length; i++) {
      const blocks: Block[] = [];
      const shapeLine = shape[i];

      for (let j = 0; j < shapeLine.length; j++) {
        if (shape[i][j]) {
          blocks.push(new Block(this.color));
        } else {
          blocks.push(new EmptyBlock());
        }
      }
      this.blocks.push(blocks);
    }
  }

  cut(completeLines: number[]) {
    if (!this.movable) {
      const newShape: Block[][] = [];
      for (let i = 0; i < this.blocks.length; i++) {
        const y = this.position.y + i;
        if (!completeLines.find(line => line === y)) {
          newShape.push(this.blocks[i]);
        }
      }
      if (newShape.length != this.blocks.length) {
        this.blocks = [...newShape];
      }
    }
  }
}
