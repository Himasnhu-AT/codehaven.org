export class Scroll {
  private scrollTop: number;
  private scrollLeft: number;

  constructor() {
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }

  getScrollTop(): number {
    return this.scrollTop;
  }

  getScrollLeft(): number {
    return this.scrollLeft;
  }

  setScrollTop(value: number): void {
    this.scrollTop = value;
  }

  setScrollLeft(value: number): void {
    this.scrollLeft = value;
  }

  scrollUp(lines: number): void {
    this.scrollTop = Math.max(0, this.scrollTop - lines);
  }

  scrollDown(lines: number): void {
    this.scrollTop += lines;
  }

  scrollLeft(columns: number): void {
    this.scrollLeft = Math.max(0, this.scrollLeft - columns);
  }

  scrollRight(columns: number): void {
    this.scrollLeft += columns;
  }
}
