import { useCallback, useEffect, useLayoutEffect } from "react"
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
  defaultResizeCanvasToFullWidthImage,
  setImagesSize
} from "../../entities/renderer/model"
import { FinishCallback, initToolManager, setActiveTool, setPipetteColor, setPrimaryColor, setSecondaryColor } from "../../entities/tools/model"
import { BottomEditorInfo } from "../../widgets/bottom-editor-info"
import { Canvas } from "../../widgets/canvas"
import { TopEditorPanel } from "../../widgets/top-editor-panel"
import { MainContainer } from "./styles"
import { convertToRgb } from "../../shared/lib"

export const Editor: React.FC = () => {
  const dispatch = useAppDispatch()
  const canvas = useAppSelector(state => state.canvasSlice.canvas)
  const renderer = useAppSelector(state => state.canvasSlice.renderer);

  const activeTool = useAppSelector(state => state.toolSlice.activeTool);

  const onChangeCanvas = useCallback<RendererSubscriber>(({ drawableList, size, origSize }) => {
    console.log('onChangeCanvas!')
    dispatch(setIsCanvasEmpty(drawableList.length === 0))
    dispatch(setCanvasSize(size))
    dispatch(setImagesSize(origSize))

    if (drawableList.length) {
      dispatch(defaultResizeCanvasToFullWidthImage())
    }
  }, [dispatch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onPipetteFinish: FinishCallback = async ({ isCancelled, result, preview }) => {
    await new Promise(resolve => setTimeout(resolve, 1e2));
    if (!isCancelled && preview) {
      const { pixelColor } = preview;
      dispatch(setPipetteColor(pixelColor))
    }

    if (result) {
      dispatch(setActiveTool(null))
      const { pixelColor } = result;
      if (result.isPrimary) {
        dispatch(setPrimaryColor(pixelColor))
      } else {
        dispatch(setSecondaryColor(pixelColor))
      }
    }
  }

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
    if (!canvas || !renderer) return;
    dispatch(initToolManager({
      canvas,
      renderer,
      onPipetteChange: onPipetteFinish,
    }))
  }, [canvas, dispatch, onPipetteFinish, renderer])

  return (
    <MainContainer activeTool={activeTool}>
      <TopEditorPanel />
      <Canvas />
      <BottomEditorInfo />
    </MainContainer>
  )
}