import { Button } from "antd";
import React, { ChangeEventHandler, useContext } from "react";
import { CanvasContext } from "../../pages/editor/context";
import { DrawableImage } from "../../entities/drawable-object/ui/drawable-image";
import { Container } from "./style";
import { FinishCallback } from "../../entities/tools/pipette";


export const TopEditorPanel: React.FC = () => {
  const context = useContext(CanvasContext)

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      throw new Error('No file was provided')
    }

    context?.renderer?.current?.addDrawable(new DrawableImage(file))
  }

  const onPipetteClick = async () => {
    context?.toolManager.current?.startTool('pipette', onPipetteFinish)
  }

  const onPipetteFinish: FinishCallback = ({ pixelColor }) => {
    console.log('pixelColor', pixelColor)
  }

  return (
    <Container>
      <Button shape="round" onClick={onPipetteClick} ghost>
        Пипетка
      </Button>
      <input type="file" onChange={onChange} />
    </Container>
  )
}