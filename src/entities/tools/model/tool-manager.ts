import { RootCanvas } from "../../canvas/model";
import { Renderer } from "../../renderer";
import { MoverTool } from "./mover";
import { PipetteTool } from "./pipette";

export class ToolManager {
  private canvas: RootCanvas;

  public moverTool: MoverTool;
  public pipetteTool: PipetteTool;

  constructor(canvas: RootCanvas, renderer: Renderer) {
    this.canvas = canvas;

    this.pipetteTool = new PipetteTool(this.canvas);
    this.moverTool = new MoverTool(renderer);
  }
}
