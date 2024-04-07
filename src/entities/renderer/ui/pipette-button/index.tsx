import { PushpinFilled } from "@ant-design/icons";
import { Button } from "antd";
import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../app/store";
import { convertToRgb } from "../../../../shared/lib";
import { FinishCallback, setActiveTool, setPipetteColor, startPipetteClick } from "../../../tools/model";
import { Container } from "./styles";

export const PipetteButton: React.FC = () => {
  const dispatch = useDispatch();
  const isCanvasEmpty = useAppSelector(state => state.canvasSlice.isCanvasEmpty)
  const activeTool = useAppSelector(state => state.toolSlice.activeTool)
  const isPipetteAction = useMemo(() => activeTool === 'pipette', [activeTool])

  const onPipetteClick = async () => {
    dispatch(setActiveTool('pipette'))
    dispatch(startPipetteClick(onPipetteFinish))
  }

  const onPipetteFinish: FinishCallback = ({ isCancelled, result }) => {
    dispatch(setActiveTool(null))
    if (!isCancelled && result) {
      const { pixelColor } = result;
      dispatch(setPipetteColor(convertToRgb(pixelColor)))
    }
  }

  console.log('isPipetteAction', isPipetteAction, activeTool)


  return (
    <Container>
      <Button
        shape="round"
        icon={<PushpinFilled />}
        onClick={onPipetteClick}
        disabled={isCanvasEmpty}
        type={isPipetteAction ? 'primary' : 'dashed'}
      >
        Pipette
      </Button>
    </Container>
  )
}