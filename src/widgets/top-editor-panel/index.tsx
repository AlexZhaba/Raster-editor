import { Button } from "antd";
import React, { ChangeEventHandler } from "react";
import { Container } from "./style";
import { FinishCallback, setPipetteColor, startPipetteClick } from "../../entities/tools/model";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { addImageToCanvas } from "../../entities/renderer/model";
import { convertToRgb } from "../../shared/lib";


export const TopEditorPanel: React.FC = () => {
  const dispatch = useAppDispatch()
  const isCanvasEmpty = useAppSelector(state => state.canvasSlice.isCanvasEmpty)

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      throw new Error('No file was provided')
    }

    dispatch(addImageToCanvas(file))
  }

  const onPipetteClick = async () => {
    dispatch(startPipetteClick(onPipetteFinish))
  }

  const onPipetteFinish: FinishCallback = ({ pixelColor }) => {
    dispatch(setPipetteColor(convertToRgb(pixelColor)))
  }

  return (
    <Container>
      <Button shape="round" onClick={onPipetteClick} disabled={isCanvasEmpty}>
        Пипетка
      </Button>
      <input type="file" onChange={onChange} />
    </Container>
  )
}