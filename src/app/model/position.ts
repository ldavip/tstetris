export class Position {
  x: number;
  y: number;

  constructor(y: number, x: number) {
    this.x = x;
    this.y = y;
  }

  addX(value: number): Position {
    return this.add(value, 0);
  }

  addY(value: number): Position {
    return this.add(0, value);
  }

  add(x: number, y: number): Position {
    return new Position(this.y + y, this.x + x);
  }
}
