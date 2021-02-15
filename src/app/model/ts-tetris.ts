import { Block } from './block';
import { EmptyBlock } from './empty-block';
import { FixedBlock } from './fixed-block';
import { Movement } from './movement.enum';
import { BlueJ } from './pieces/blue-j';
import { CyanI } from './pieces/cyan-i';
import { GrayBlock } from './pieces/gray-block';
import { GreenS } from './pieces/green-s';
import { OrangeL } from './pieces/orange-l';
import { PurpleT } from './pieces/purple-t';
import { RedZ } from './pieces/red-z';
import { YellowO } from './pieces/yellow-o';
import { Polyomino } from './polyomino';
import { Position } from './position';
import { Tetromino } from './tetromino';

export class TsTetris {
  public LEVEL_INCREASE = 20;
  private static seed = 0;
  private LEVEL_UP = 1000;
  private STARTING_TICK = 500;
  private LINE_CLEAR_SCORE = [0, 40, 100, 300, 1200];

  public static readonly INITIAL_POSITION = new Position(0, 5);
  public static readonly HEIGHT = 22;
  public static readonly WIDTH = 12;

  private tetrominoes: Tetromino[] = [];

  private polyominos: (() => Polyomino)[] = [
    () => new BlueJ(),
    () => new CyanI(),
    () => new GreenS(),
    () => new OrangeL(),
    () => new PurpleT(),
    () => new RedZ(),
    () => new YellowO(),
  ];

  ticking = false;
  gameover = false;
  cheated = false;
  paused = false;

  timer: any;

  gameoverListener?: () => void;
  tickListener?: () => void;

  next!: Tetromino;
  current!: Tetromino;
  private score = 0;
  private level = 0;
  private tick!: number;

  board: Block[][] = [];

  get currentLevel() {
    return this.level + 1;
  }

  get playing(): boolean {
    return this.ticking;
  }

  getScore() {
    return this.score;
  }

  pause() {
    this.paused = !this.paused;
  }

  start() {
    this.score = 0;
    this.level = 0;
    this.tetrominoes = [];
    this.initBoard();
    this.startTicking(this.STARTING_TICK);
  }

  stop() {
    this.setTicking(false);
    this.paused = false;
    this.gameover = true;
    if (this.gameoverListener) {
      this.gameoverListener();
    }
  }

  setTicking(ticking: boolean) {
    if (this.ticking && !ticking && this.timer) {
      clearInterval(this.timer);
    }
    this.ticking = ticking;
  }

  updateBoard() {
    for (const line of this.board) {
      for (let i = 0; i < line.length; i++) {
        if (!(line[i] instanceof FixedBlock)) {
          line[i] = new EmptyBlock();
        }
      }
    }

    for (let piece of this.tetrominoes) {
      const shape = piece.shape;
      const position = piece.position;

      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[0].length; j++) {
          if (shape[i][j].color && position) {
            const shapePosition = position.add(j, i);

            if (this.isValid(shapePosition)) {
              this.board[shapePosition.y][shapePosition.x] = new Block(piece.color);
            } else {
              console.error(`[updateBoard] The position (x: ${shapePosition.x}, y: ${shapePosition.y}) is invalid!`);
            }
          }
        }
      }
    }
  }

  nextRand(limit: number): number {
    return +(Math.random() * limit).toFixed() % limit;
  }

  sortNextPiece() {
    const polyomino = this.polyominos[this.nextRand(this.polyominos.length)];
    this.next = new Tetromino(polyomino());
  }

  initBoard() {
    this.board = [];
    for (let i = 0; i < TsTetris.HEIGHT; i++) {
      const blocks = [];
      for (let j = 0; j < TsTetris.WIDTH; j++) {
        blocks.push(new EmptyBlock());
      }
      this.board.push(blocks);
    }

    this.tetrominoes.push(new FixedBlock(new GrayBlock(), new Position(0, 0)));
    this.tetrominoes.push(
      new FixedBlock(new GrayBlock(), new Position(0, TsTetris.WIDTH - 1))
    );

    for (let i = 0; i < TsTetris.HEIGHT - 1; i++) {
      this.tetrominoes.push(
        new FixedBlock(new GrayBlock(), new Position(i, 0))
      );
      this.tetrominoes.push(
        new FixedBlock(new GrayBlock(), new Position(i, TsTetris.WIDTH - 1))
      );
    }

    for (let i = 0; i < TsTetris.WIDTH; i++) {
      this.tetrominoes.push(
        new FixedBlock(new GrayBlock(), new Position(TsTetris.HEIGHT - 1, i))
      );
    }

    this.updateBoard();
    this.sortNextPiece();
  }

  startTicking(tick: number) {
    this.tick = tick;
    this.ticking = true;
    if (this.timer != null) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      if (!this.paused) {
        if (!this.current || !this.current.movable) {
          this.verifyCompletedLines();
          this.addNextPiece();
          this.checkGameOver();
        } else {
          const newPosition = this.current.position.addY(1);
          if (this.isValidPosition(this.current, newPosition) && !this.hasColission(this.current, newPosition)) {
            this.current.position = newPosition;
          } else {
            this.current.movable = false;
          }
        }
        this.updateBoard();
        if (this.tickListener) {
          this.tickListener();
        }
      }
    }, this.tick);
  }

  updateTickFrequency(tick: number) {
    this.tick = tick;
    this.startTicking(tick);
  }

  hasColission(piece: Tetromino, position: Position) {
    if (!this.isValidPosition(piece, position)) {
      return true;
    }

    const pieces = this.tetrominoes.filter((p) => p != piece);
    const matrix = this.getCollisionMatrix(pieces);

    const shape = piece.shape;

    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[0].length; j++) {
        const matrixPosition = position.add(j, i);

        if (this.isValid(matrixPosition)) {
          const block = shape[i][j];
          const matrixBlock = matrix[matrixPosition.y][matrixPosition.x];

          if (block && block.color && matrixBlock) {
            return true;
          }
        } else {
          return true;
        }
      }
    }

    return false;
  }

  checkGameOver() {
    if (
      this.current.movable &&
      this.hasColission(this.current, this.current.position.addY(1))
    ) {
      this.stop();
    }
  }

  addNextPiece() {
    this.next.position = TsTetris.INITIAL_POSITION;
    this.next.movable = true;
    this.tetrominoes.push(this.next);

    this.current = this.next;
    this.sortNextPiece();
  }

  verifyCompletedLines() {
    const completeLines = this.searchCompleteLines();
    if (completeLines.length) {
      const linesCut = completeLines.length;
      const pieces = this.getGameTetrominoes();

      // cut pieces of complete lines
      pieces.forEach((p) => p.cut(completeLines));

      // adjust pieces position
      pieces
        .filter((p) => p.position.y < completeLines[linesCut - 1])
        .forEach((p) => (p.position = p.position?.addY(linesCut)));

      // find pieces completely cut
      const piecesCut = pieces.filter((p) => p.height === 0);

      // remove pieces
      piecesCut.forEach((p) => pieces.splice(pieces.indexOf(p)));

      this.computeScore(linesCut);
    }
  }

  computeScore(linesCut: number) {
    this.score += this.LINE_CLEAR_SCORE[linesCut];
    this.updateLevel();
  }

  updateLevel() {
    const newLevel = +(this.score / this.LEVEL_UP).toFixed(0);
    if (newLevel > this.level) {
      this.level = newLevel;
      this.updateTickFrequency(
        this.STARTING_TICK - newLevel * this.LEVEL_INCREASE
      );
    }
  }

  getGameTetrominoes() {
    return this.tetrominoes.filter((p) => p.removable);
  }

  searchCompleteLines(): number[] {
    const lines = [];
    const board = this.board;

    for (let i = 0; i < TsTetris.HEIGHT - 1; i++) {
      const line = board[i];

      let count = 0;
      for (const block of line) {
        if (block instanceof EmptyBlock) {
          break;
        }
        count++;
      }

      if (count === line.length) {
        lines.push(i);
      }
    }

    return lines;
  }

  getCollisionMatrix(pieces: Tetromino[]) {
    const matrix: boolean[][] = [];
    for (let i = 0; i < TsTetris.HEIGHT; i++) {
      const line: boolean[] = [];
      for (let j = 0; j < TsTetris.WIDTH; j++) {
        line.push(false);
      }
      matrix.push(line);
    }

    for (const piece of pieces) {
      const shape = piece.shape;
      const position = piece.position;

      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[0].length; j++) {
          const block = shape[i][j];
          const matrixPosition = position.add(j, i);

          if (this.isValid(matrixPosition)) {
            matrix[matrixPosition.y][matrixPosition.x] = block && !!block.color;
          } else {
            console.error(`[getCollisionMatrix] Invalid position (x: ${matrixPosition.x}, y: ${matrixPosition.y})`);
          }
        }
      }
    }
    return matrix;
  }

  handleMovement(movement: Movement) {
    if (this.paused) {
      return;
    }
    if (movement != null && this.current) {
      switch (movement) {
        case Movement.LEFT:
          {
            const newPosition = this.current.position.addX(-1);
            if (this.isValidPosition(this.current, newPosition) && !this.hasColission(this.current, newPosition)) {
              this.current.position = newPosition;
            }
          }
          break;
        case Movement.RIGHT:
          {
            const newPosition = this.current.position.addX(1);
            if (this.isValidPosition(this.current, newPosition) && !this.hasColission(this.current, newPosition)) {
              this.current.position = newPosition;
            }
          }
          break;
        case Movement.SPEED:
          {
            const newPosition = this.current.position.addY(2);
            if (this.isValidPosition(this.current, newPosition) && !this.hasColission(this.current, newPosition)) {
              this.current.position = newPosition;
            }
          }
          break;
        case Movement.ROTATE:
          {
            this.current.turnClockwise();
            if (this.hasColission(this.current, this.current.position)) {
              this.current.turnAntiClockwise();
            }
          }
          break;
      }
    }
  }

  changeNextPiece() {
    if (!this.cheated) {
      this.LEVEL_INCREASE *= 2;
    }
    this.sortNextPiece();
  }

  isValid(position: Position): boolean {
    return position.y < TsTetris.HEIGHT && position.x < TsTetris.WIDTH;
  }

  isValidPosition(piece: Tetromino, position: Position): boolean {
    return this.isValid(position) && this.isValid(position.add(piece.width, piece.height));
  }
}
