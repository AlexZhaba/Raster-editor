import { RootCanvas } from "../../canvas/model/canvas";

export interface PipetteToolResult {
  pixelColor: readonly [number, number, number];
}

export type CallbackResult =
  | { isCancelled: false; result: PipetteToolResult }
  | { isCancelled: true; result: null };

export type FinishCallback = (result: CallbackResult) => void;

export class PipetteTool {
  private callback: ((event: MouseEvent) => void) | null = null;
  private keydownCallback: ((event: KeyboardEvent) => void) | null = null;
  private finishCallback: FinishCallback | null = null;

  private canvas: RootCanvas;
  protected isActive = false;
  private lastPipetteColor: readonly [number, number, number] | null = null;

  constructor(canvas: RootCanvas) {
    this.canvas = canvas;
  }

  public startTool(callback: FinishCallback) {
    this.finishCallback = callback;
    this.callback = this.handleCanvasClick.bind(this);
    this.keydownCallback = this.onKeydown.bind(this);
    document.addEventListener("click", this.callback);
    document.addEventListener("keydown", this.keydownCallback);

    this.isActive = true;
  }

  private removeAllEventListeners() {
    if (this.callback && this.keydownCallback) {
      document.removeEventListener("click", this.callback);
      document.removeEventListener("keydown", this.keydownCallback);
    } else {
      console.log("You are trying to stop tool which is not started");
    }

    this.isActive = false;
  }

  public stopToolPreventually() {
    this.removeAllEventListeners();

    this.finishCallback?.({
      isCancelled: true,
      result: null,
    });
    return;
  }

  private stopToolSuccessfully() {
    this.removeAllEventListeners();

    if (!this.lastPipetteColor) {
      throw new Error("You are dispatching ");
    }
    this.finishCallback?.({
      isCancelled: false,
      result: {
        pixelColor: this.lastPipetteColor,
      },
    });
  }

  public onKeydown(event: KeyboardEvent) {
    const isCloseEvent = event.key === "Escape";
    if (isCloseEvent) {
      console.log("stopped");
      this.stopToolPreventually();
    }
  }

  private handleCanvasClick(event: MouseEvent) {
    const { pageX, pageY } = event;
    const { x: canvasX, y: canvasY } =
      this.canvas.convertWindowCoordinatesToCanvas(pageX, pageY);
    console.log("canvasX", canvasX, "canvasY", canvasY);

    const pixelColor = this.canvas.getPixelColor(canvasX, canvasY);

    this.lastPipetteColor = [
      pixelColor[0],
      pixelColor[1],
      pixelColor[2],
    ] as const;

    this.stopToolSuccessfully();
  }
}
