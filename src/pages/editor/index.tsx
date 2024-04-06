import { BottomEditorInfo } from "../../widgets/bottom-editor-info"
import { Canvas } from "../../widgets/canvas"
import { TopEditorPanel } from "../../widgets/top-editor-panel"
import { MainContainer } from "./styles"

export const Editor: React.FC = () => {
  return (
    <MainContainer>
      <TopEditorPanel />
      <Canvas />
      <BottomEditorInfo />
    </MainContainer>
  )
}