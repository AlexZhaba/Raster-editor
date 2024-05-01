import { KeyboardMoveInspector } from "./../../../shared/lib/move-insepector/keyboard-move-inspector";
import {
  DraggableMoveInspector,
  MouseChangeStatusHandler,
  MoveInspector,
} from "../../../shared/lib/move-insepector";
import { Renderer } from "../../renderer";

export class MoverTool {
  private inspectors: MoveInspector[];
  private renderer: Renderer;

  protected isActive = false;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.inspectors = [
      new DraggableMoveInspector(),
      new KeyboardMoveInspector(),
    ];
  }

  public startTool(onChangeStatus: MouseChangeStatusHandler) {
    this.isActive = true;
    for (const inspector of this.inspectors) {
      inspector.onChangeStatus(onChangeStatus);
      inspector.onMove(this.renderer.moveTo.bind(this.renderer));
      inspector.inspect();
    }
  }

  public setSpeed(speedCoef: number) {
    for (const inspector of this.inspectors) {
      inspector.setSpeedCoef?.(speedCoef);
    }
  }

  public stopTool() {
    this.isActive = false;
    for (const inspector of this.inspectors) {
      console.log("inspector stop");
      inspector.stop();
    }
  }
}
