/**
 * Клас
 */
export class RootCanvas {
  private root: HTMLCanvasElement;

  constructor(id: string) {
    const canvasRoot = document.getElementById(id);

    if (!canvasRoot) {
      throw new Error("Root for canvas does not exists");
    }

    const isCanvas = canvasRoot instanceof HTMLCanvasElement;
    if (!isCanvas) {
      throw new Error("Root for canvas does not instance of canvas");
    }

    this.root = canvasRoot;
  }

  public getContext() {
    const context = this.root.getContext("2d");
    if (!context) {
      throw new Error("Context is not exist for canvas root element");
    }
    return context;
  }

  public setCanvasSize(width: number, height: number) {
    this.root.width = width;
    this.root.height = height;
  }

  public getPixelColor(x: number, y: number) {
    return this.getContext().getImageData(x, y, 1, 1).data;
  }
}
