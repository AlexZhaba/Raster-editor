export interface DrawableSize {
  width: number;
  height: number;
}

export interface DrawableObject {
  draw(context: CanvasRenderingContext2D): void | Promise<void>;
  getSize(): DrawableSize | Promise<DrawableSize>;
}
