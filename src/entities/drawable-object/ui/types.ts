export interface DrawableSize {
  width: number;
  height: number;
}

export interface DrawableObject {
  draw(
    x: number,
    y: number,
    context: CanvasRenderingContext2D
  ): void | Promise<void>;
  getSize(): DrawableSize | Promise<DrawableSize>;
  resize(scaleX: number, scaleY: number): void;
}
