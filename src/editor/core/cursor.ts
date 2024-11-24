export class Cursor {
  private position: { line: number; column: number };

  constructor() {
    this.position = { line: 1, column: 1 };
  }

  getPosition() {
    return this.position;
  }

  setPosition(line: number, column: number) {
    this.position = { line, column };
  }

  moveUp() {
    if (this.position.line > 1) {
      this.position.line -= 1;
    }
  }

  moveDown() {
    this.position.line += 1;
  }

  moveLeft() {
    if (this.position.column > 1) {
      this.position.column -= 1;
    } else if (this.position.line > 1) {
      this.position.line -= 1;
      this.position.column = Number.MAX_SAFE_INTEGER; // Move to the end of the previous line
    }
  }

  moveRight() {
    this.position.column += 1;
  }
}
