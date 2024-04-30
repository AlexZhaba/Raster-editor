import { KeyboardMoveInspector } from "./../../../shared/lib/move-insepector/keyboard-move-inspector";
import {
  DraggableMoveInspector,
  MouseChangeStatusHandler,
  MoveInspector,
} from "../../../shared/lib/move-insepector";
import { Renderer } from "../../renderer";

export class MoverTool {
  private inspectors: MoveInspector[] = [
    new DraggableMoveInspector(),
    new KeyboardMoveInspector(),
  ];
  private renderer: Renderer;

  protected isActive = false;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
  }

  public startTool(onChangeStatus: MouseChangeStatusHandler) {
    this.isActive = true;
    for (const inspector of this.inspectors) {
      inspector.onChangeStatus(onChangeStatus);
      inspector.onMove(this.renderer.moveTo.bind(this.renderer));
      inspector.inspect();
    }
  }

  public stopTool() {
    this.isActive = false;
    for (const inspector of this.inspectors) {
      inspector.stop();
    }
  }
}
