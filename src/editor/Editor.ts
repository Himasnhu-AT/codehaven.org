import { Cursor } from "./core/cursor";
import { TextModel } from "./core/models";
import { Position } from "./core/position";
import { Range } from "./core/range";
import { Scroll } from "./core/scroll";
import { Tokenizer } from "./core/tokenizer";
import { Selection } from "./core/selection";

export class Editor {
  private cursor: Cursor;
  private model: TextModel;
  private scroll: Scroll;
  private tokenizer: Tokenizer;
  private selection: Selection;

  constructor(text: string) {
    this.cursor = new Cursor();
    this.model = new TextModel(text);
    this.scroll = new Scroll();
    this.tokenizer = new Tokenizer();
    this.selection = new Selection();
  }

  handleKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
        this.cursor.moveUp();
        break;
      case "ArrowDown":
        this.cursor.moveDown();
        break;
      case "ArrowLeft":
        this.cursor.moveLeft();
        break;
      case "ArrowRight":
        this.cursor.moveRight();
        break;
      case "Backspace":
        this.deleteCharacter();
        break;
      case "Enter":
        this.insertText("\n");
        break;
      default:
        if (event.key.length === 1) {
          this.insertText(event.key);
        }
        break;
    }
  }

  handleMouseClick(event: MouseEvent) {
    const position = this.calculatePositionFromMouseEvent(event);
    this.cursor.setPosition(position.line, position.column);
  }

  private calculatePositionFromMouseEvent(event: MouseEvent): Position {
    // Placeholder logic for calculating position from mouse event
    return new Position(1, 1);
  }

  private insertText(text: string) {
    const position = this.cursor.getPosition();
    this.model.insertText(position.line, position.column, text);
    this.cursor.moveRight();
  }

  private deleteCharacter() {
    const position = this.cursor.getPosition();
    this.model.deleteText(position.line, position.column - 1, 1);
    this.cursor.moveLeft();
  }

  getText(): string {
    return this.model.getText();
  }

  getCursorPosition(): { line: number; column: number } {
    return this.cursor.getPosition();
  }

  getScrollPosition(): { top: number; left: number } {
    return {
      top: this.scroll.getScrollTop(),
      left: this.scroll.getScrollLeft(),
    };
  }

  setScrollPosition(top: number, left: number) {
    this.scroll.setScrollTop(top);
    this.scroll.setScrollLeft(left);
  }

  tokenize() {
    const text = this.model.getText();
    return this.tokenizer.tokenize(text);
  }

  selectRange(startLine: number, startColumn: number, endLine: number, endColumn: number) {
    const range = new Range(startLine, startColumn, endLine, endColumn);
    this.selection.setRange(range);
  }

  getSelectionRange(): Range | null {
    return this.selection.getRange();
  }
}
