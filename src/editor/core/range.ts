export class Range {
  private start: { line: number; column: number };
  private end: { line: number; column: number };

  constructor(startLine: number, startColumn: number, endLine: number, endColumn: number) {
    this.start = { line: startLine, column: startColumn };
    this.end = { line: endLine, column: endColumn };
  }

  getStart() {
    return this.start;
  }

  getEnd() {
    return this.end;
  }

  setStart(line: number, column: number) {
    this.start = { line, column };
  }

  setEnd(line: number, column: number) {
    this.end = { line, column };
  }

  containsPosition(line: number, column: number): boolean {
    const startBefore = line > this.start.line || (line === this.start.line && column >= this.start.column);
    const endAfter = line < this.end.line || (line === this.end.line && column <= this.end.column);
    return startBefore && endAfter;
  }

  intersectsRange(other: Range): boolean {
    const startBeforeEnd = this.start.line < other.end.line || (this.start.line === other.end.line && this.start.column <= other.end.column);
    const endAfterStart = this.end.line > other.start.line || (this.end.line === other.start.line && this.end.column >= other.start.column);
    return startBeforeEnd && endAfterStart;
  }

  isEqual(other: Range): boolean {
    return this.start.line === other.start.line && this.start.column === other.start.column &&
           this.end.line === other.end.line && this.end.column === other.end.column;
  }

  clone(): Range {
    return new Range(this.start.line, this.start.column, this.end.line, this.end.column);
  }
}
