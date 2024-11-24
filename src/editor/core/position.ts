export class Position {
  private line: number;
  private column: number;

  constructor(line: number, column: number) {
    this.line = line;
    this.column = column;
  }

  getLine(): number {
    return this.line;
  }

  getColumn(): number {
    return this.column;
  }

  setLine(line: number): void {
    this.line = line;
  }

  setColumn(column: number): void {
    this.column = column;
  }

  isEqual(other: Position): boolean {
    return this.line === other.line && this.column === other.column;
  }

  isBefore(other: Position): boolean {
    if (this.line < other.line) {
      return true;
    }
    if (this.line === other.line && this.column < other.column) {
      return true;
    }
    return false;
  }

  isAfter(other: Position): boolean {
    if (this.line > other.line) {
      return true;
    }
    if (this.line === other.line && this.column > other.column) {
      return true;
    }
    return false;
  }

  clone(): Position {
    return new Position(this.line, this.column);
  }
}
