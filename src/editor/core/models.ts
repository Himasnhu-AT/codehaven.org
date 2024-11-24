export class TextModel {
  private lines: string[];

  constructor(text: string) {
    this.lines = text.split("\n");
  }

  getLine(lineNumber: number): string {
    return this.lines[lineNumber - 1];
  }

  getLineCount(): number {
    return this.lines.length;
  }

  getText(): string {
    return this.lines.join("\n");
  }

  setText(text: string): void {
    this.lines = text.split("\n");
  }

  insertText(lineNumber: number, column: number, text: string): void {
    const line = this.lines[lineNumber - 1];
    const newLine = line.slice(0, column - 1) + text + line.slice(column - 1);
    this.lines[lineNumber - 1] = newLine;
  }

  deleteText(lineNumber: number, column: number, length: number): void {
    const line = this.lines[lineNumber - 1];
    const newLine = line.slice(0, column - 1) + line.slice(column - 1 + length);
    this.lines[lineNumber - 1] = newLine;
  }
}
