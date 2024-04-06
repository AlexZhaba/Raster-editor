import { RootCanvas } from "../../canvas/model/canvas";

export interface PipetteToolResult {
  /**
  //  * [Red, Green, Black]
   */
  pixelColor: readonly [number, number, number];
}

export type FinishCallback = (result: PipetteToolResult) => void;

export class PipetteTool {
  private callback: ((event: MouseEvent) => void) | null = null;
  private finishCallback: FinishCallback | null = null;

  private canvas: RootCanvas;
  protected isActive = false;

  constructor(canvas: RootCanvas) {
    this.canvas = canvas;
  }

  public startTool(callback: FinishCallback) {
    this.finishCallback = callback;
    this.callback = this.handleCanvasClick.bind(this);
    document.addEventListener("click", this.callback);

    this.isActive = true;
  }

  public stopTool() {
    if (this.callback) {
      document.removeEventListener("click", this.callback);
    } else {
      console.log("You are trying to stop tool which is not started");
    }

    this.isActive = false;
  }

  private handleCanvasClick(event: MouseEvent) {
    const { pageX, pageY } = event;
    const pixelColor = this.canvas.getPixelColor(pageX, pageY);
    console.log(pixelColor, pageX, pageY);
    const rgb = [pixelColor[0], pixelColor[1], pixelColor[2]] as const;

    this.finishCallback?.({
      pixelColor: rgb,
    });

    this.stopTool();
  }
}
