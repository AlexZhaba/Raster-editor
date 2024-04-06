import { useCallback, useEffect, useLayoutEffect, } from "react"
import { useAppDispatch, useAppSelector } from "../../app/store"
import { bindRendererUpdate, initRenderer, setIsCanvasEmpty } from "../../entities/renderer/model"
import { initToolManager } from "../../entities/tools/model"
import { BottomEditorInfo } from "../../widgets/bottom-editor-info"
import { Canvas } from "../../widgets/canvas"
import { TopEditorPanel } from "../../widgets/top-editor-panel"
import { MainContainer } from "./styles"

export const Editor: React.FC = () => {
  const dispatch = useAppDispatch()
  const canvas = useAppSelector(state => state.canvasSlice.canvas)

  const onChangeCanvas = useCallback((imageCount: number) => {
    dispatch(setIsCanvasEmpty(imageCount === 0))
  }, [dispatch])

  useLayoutEffect(() => {
    dispatch(initRenderer())
    dispatch(bindRendererUpdate(({ drawableList }) => onChangeCanvas(drawableList.length)))
  }, [dispatch, onChangeCanvas]);

  useEffect(() => {
    if (!canvas) return;
    dispatch(initToolManager(canvas))
  }, [canvas, dispatch])

  return (
    <MainContainer>
      <TopEditorPanel />
      <Canvas />
      <BottomEditorInfo />
    </MainContainer>
  )
}