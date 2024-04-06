import { RootCanvas } from "../../canvas/model";
import { FinishCallback, PipetteTool } from "./pipette";

type Tool = "pipette";

const toolNameMap = {
  pipette: "pipetteTool",
} as const;

export class ToolManager {
  private canvas: RootCanvas;

  public pipetteTool: PipetteTool;

  constructor(canvas: RootCanvas) {
    this.canvas = canvas;

    this.pipetteTool = new PipetteTool(this.canvas);
  }

  public async startTool(tool: Tool, callback: FinishCallback) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    this[toolNameMap[tool]].startTool(callback);
  }
}
