import { useLayoutEffect, useRef } from "react"
import { CANVAS_ROOT_ID } from "../../entities/canvas/model"
import { Renderer } from "../../entities/renderer/model"
import { ToolManager } from "../../entities/tools/tool-manager"
import { BottomEditorInfo } from "../../widgets/bottom-editor-info"
import { Canvas } from "../../widgets/canvas"
import { TopEditorPanel } from "../../widgets/top-editor-panel"
import { CanvasContext } from "./context"
import { MainContainer } from "./styles"

export const Editor: React.FC = () => {
  const renderer = useRef<Renderer | null>(null);
  const toolManager = useRef<ToolManager | null>(null);

  useLayoutEffect(() => {
    renderer.current = new Renderer(CANVAS_ROOT_ID)
    toolManager.current = new ToolManager(renderer.current.canvas)
  }, []);
  return (
    <CanvasContext.Provider value={{
      renderer: renderer,
      toolManager: toolManager
    }}>
      <MainContainer>
        <TopEditorPanel />
        <Canvas />
        <BottomEditorInfo />
      </MainContainer>
    </CanvasContext.Provider>
  )
}