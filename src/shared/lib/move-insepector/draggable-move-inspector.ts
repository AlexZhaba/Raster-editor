import {
  MouseChangeStatusHandler,
  MouseMoveHandler,
  MoveInspector,
  Listener,
} from "./types";

export class DraggableMoveInspector implements MoveInspector {
  private onChangeStatusHandler: MouseChangeStatusHandler | null = null;
  private onMoveHandler: MouseMoveHandler | null = null;

  private prevCoord: [number, number] | null = null;
  private startMove = false;

  private onMouseDownHandler: Listener<"mousedown">;
  private onMouseUpHandler: Listener<"mouseup">;
  private onMouseMoveHandler: Listener<"mousemove">;

  constructor() {
    this.onMouseDownHandler = this.onMouseDown.bind(this);
    this.onMouseUpHandler = this.onMouseUp.bind(this);
    this.onMouseMoveHandler = this.onMouseMove.bind(this);
  }

  public inspect() {
    document.addEventListener("mousedown", this.onMouseDownHandler);
    document.addEventListener("mouseup", this.onMouseUpHandler);
    document.addEventListener("mousemove", this.onMouseMoveHandler);
  }

  public stop() {
    console.log("start removving");
    document.removeEventListener("mousedown", this.onMouseDownHandler);
    document.removeEventListener("mouseup", this.onMouseUpHandler);
    document.removeEventListener("mousemove", this.onMouseMoveHandler);
  }

  public onChangeStatus(onChangeStatus: MouseChangeStatusHandler) {
    this.onChangeStatusHandler = onChangeStatus;
  }

  public onMove(onMove: MouseMoveHandler) {
    this.onMoveHandler = onMove;
  }

  public onMouseDown(event: MouseEvent) {
    this.onChangeStatusHandler?.("start");
    this.startMove = true;
    this.prevCoord = [event.pageX, event.pageY];
  }

  public onMouseUp(event: MouseEvent) {
    this.onChangeStatusHandler?.("end");
    this.startMove = false;
  }

  public onMouseMove(event: MouseEvent) {
    if (!this.startMove) return;

    if (!this.prevCoord) {
      this.prevCoord = [event.pageX, event.pageY];
      return;
    }

    console.log(this.prevCoord);

    const deltaX = event.pageX - this.prevCoord[0];
    const deltaY = event.pageY - this.prevCoord[1];

    this.prevCoord[0] = event.pageX;
    this.prevCoord[1] = event.pageY;

    this.onMoveHandler?.(deltaX, deltaY);
  }
}
