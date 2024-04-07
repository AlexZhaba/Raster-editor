import { useCallback, useEffect, useLayoutEffect, } from "react"
import { useAppDispatch, useAppSelector } from "../../app/store"
import { CanvasSubscriber } from "../../entities/canvas/model"
import {
  bindRendererUpdate,
  initRenderer,
  setIsCanvasEmpty,
  setCursor,
  bindCanvasUpdate,
  RendererSubscriber,
  setCanvasSize
} from "../../entities/renderer/model"
import { initToolManager } from "../../entities/tools/model"
import { BottomEditorInfo } from "../../widgets/bottom-editor-info"
import { Canvas } from "../../widgets/canvas"
import { TopEditorPanel } from "../../widgets/top-editor-panel"
import { MainContainer } from "./styles"

export const Editor: React.FC = () => {
  const dispatch = useAppDispatch()
  const canvas = useAppSelector(state => state.canvasSlice.canvas)
  const activeTool = useAppSelector(state => state.toolSlice.activeTool);

  const onChangeCanvas = useCallback<RendererSubscriber>(({ drawableList, size }) => {
    dispatch(setIsCanvasEmpty(drawableList.length === 0))
    dispatch(setCanvasSize(size))
  }, [dispatch])

  const onCanvasChange = useCallback<CanvasSubscriber>(({ x, y }) => {
    dispatch(setCursor({ x, y }))
  }, [dispatch])

  useLayoutEffect(() => {
    dispatch(initRenderer())
    dispatch(bindRendererUpdate(onChangeCanvas));
    dispatch(bindCanvasUpdate(onCanvasChange))
  }, [dispatch, onCanvasChange, onChangeCanvas]);

  useEffect(() => {
    if (!canvas) return;
    dispatch(initToolManager(canvas))
  }, [canvas, dispatch])

  return (
    <MainContainer activeTool={activeTool}>
      <TopEditorPanel />
      <Canvas />
      <BottomEditorInfo />
    </MainContainer>
  )
}