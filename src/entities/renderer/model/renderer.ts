import { RootCanvas } from "../../canvas/model";
import { DrawableObject } from "./../../drawable-object/ui/types";

interface CanvasSize {
  width: number;
  height: number;
}
interface SubscribeContext {
  drawableList: DrawableObject[];
  size: CanvasSize;
}

export type RendererSubscriber = (context: SubscribeContext) => void;
export class Renderer {
  private drawableList: DrawableObject[] = [];
  private canvas: RootCanvas;
  private subscriber: RendererSubscriber | null = null;

  constructor(canvas: RootCanvas) {
    this.canvas = canvas;

    this.render();
  }

  public addDrawable(drawable: DrawableObject) {
    this.drawableList.push(drawable);
    void this.render();
  }

  public async getCanvasSize(): Promise<CanvasSize> {
    let maxWidth = 0;
    let maxHeight = 0;

    for (const drawable of this.drawableList) {
      const { width, height } = await drawable.getSize();
      maxHeight = Math.max(maxHeight, height);
      maxWidth = Math.max(maxWidth, width);
    }

    return {
      width: maxWidth,
      height: maxHeight,
    };
  }

  /**
   * Отрисовка происходит в три этапа
   * 1. Высчитывается размеры элемента
   * 2. Выставляются размеры канваса
   * 3. Отрисовываются все элементы
   */
  public async render() {
    const { width, height } = await this.getCanvasSize();

    this.canvas.setCanvasSize(width, height);

    const context = this.canvas.getContext();
    for (const drawable of this.drawableList) {
      await drawable.draw(context);
    }

    this.subscriber?.({
      drawableList: this.drawableList,
      size: await this.getCanvasSize(),
    });
  }

  public subscribe(subscriber: RendererSubscriber) {
    this.subscriber = subscriber;
  }
}
