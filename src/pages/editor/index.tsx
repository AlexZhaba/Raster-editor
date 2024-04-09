import { useCallback, useEffect, useLayoutEffect, useState, } from "react"
import { useAppDispatch, useAppSelector } from "../../app/store"
import { CanvasSubscriber } from "../../entities/canvas/model"
import {
  bindRendererUpdate,
  initRenderer,
  setIsCanvasEmpty,
  setCursor,
  bindCanvasUpdate,
  RendererSubscriber,
  setCanvasSize,
  defaultResizeCanvasToFullWidthImage
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
    console.log('onChangeCanvas!')
    dispatch(setIsCanvasEmpty(drawableList.length === 0))
    dispatch(setCanvasSize(size))

    if (drawableList.length) {
      dispatch(defaultResizeCanvasToFullWidthImage())
    }
  }, [dispatch])

  const onCanvasChange = useCallback<CanvasSubscriber>(({ x, y }) => {
    dispatch(setCursor({ x, y }))
  }, [dispatch])

  useLayoutEffect(() => {
    dispatch(initRenderer())
    dispatch(bindCanvasUpdate(onCanvasChange))
  }, [dispatch, onCanvasChange]);

  useEffect(() => {
    dispatch(bindRendererUpdate(onChangeCanvas));
  }, [dispatch, onChangeCanvas])

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