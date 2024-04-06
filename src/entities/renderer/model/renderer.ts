import { RootCanvas } from "../../canvas/model";
import { DrawableObject } from "./../../drawable-object/ui/types";

export class Renderer {
  private drawableList: DrawableObject[] = [];
  public canvas: RootCanvas;

  constructor(id: string) {
    this.canvas = new RootCanvas(id);

    this.render();
  }

  public addDrawable(drawable: DrawableObject) {
    this.drawableList.push(drawable);
    void this.render();
  }

  /**
   * Отрисовка происходит в три этапа
   * 1. Высчитывается размеры элемента
   * 2. Выставляются размеры канваса
   * 3. Отрисовываются все элементы
   */
  public async render() {
    let maxWidth = 0;
    let maxHeight = 0;

    for (const drawable of this.drawableList) {
      const { width, height } = await drawable.getSize();
      maxHeight = Math.max(maxHeight, height);
      maxWidth = Math.max(maxWidth, width);
    }

    this.canvas.setCanvasSize(maxWidth, maxHeight);

    const { context } = this.canvas;
    for (const drawable of this.drawableList) {
      await drawable.draw(context);
    }
  }
}
