export class Tokenizer {
  private language: string;
  private tokens: { [line: number]: string[] };

  constructor(language: string) {
    this.language = language;
    this.tokens = {};
  }

  tokenize(text: string): void {
    const lines = text.split("\n");
    lines.forEach((line, index) => {
      this.tokens[index + 1] = this.tokenizeLine(line);
    });
  }

  private tokenizeLine(line: string): string[] {
    // Simple tokenization logic for demonstration purposes
    return line.split(/\s+/);
  }

  getTokens(lineNumber: number): string[] {
    return this.tokens[lineNumber] || [];
  }

  getLanguage(): string {
    return this.language;
  }

  setLanguage(language: string): void {
    this.language = language;
  }
}
