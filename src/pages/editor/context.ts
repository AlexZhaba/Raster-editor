import { createContext, MutableRefObject } from "react";
import { Renderer } from "../../entities/renderer/model";
import { ToolManager } from "../../entities/tools/tool-manager";

interface Context {
  renderer: MutableRefObject<Renderer | null>;
  toolManager: MutableRefObject<ToolManager | null>;
}

export const CanvasContext = createContext<Context | null>(null);
