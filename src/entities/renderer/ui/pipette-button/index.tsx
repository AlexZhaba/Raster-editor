import { PushpinFilled } from "@ant-design/icons";
import { Button } from "antd";
import React, { MouseEventHandler, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../app/store";
import { convertToRgb } from "../../../../shared/lib";
import { FinishCallback, setActiveTool, setPipetteColor, startPipetteClick, stopPipetteClick } from "../../../tools/model";
import { Container } from "./styles";

export const PipetteButton: React.FC = () => {
  const dispatch = useDispatch();
  const isCanvasEmpty = useAppSelector(state => state.canvasSlice.isCanvasEmpty)
  const activeTool = useAppSelector(state => state.toolSlice.activeTool)
  const isPipetteAction = useMemo(() => activeTool?.name === 'pipette', [activeTool])

  const onPipetteClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation()

    console.log('activeTool', activeTool)
    if (activeTool?.name === 'pipette') {
      dispatch(setActiveTool(null));
      dispatch(stopPipetteClick());
      return;
    }

    dispatch(setActiveTool({
      name: 'pipette',
      state: 'active'
    }))
    dispatch(startPipetteClick(onPipetteFinish))
  }

  const onPipetteFinish: FinishCallback = async ({ isCancelled, result }) => {
    await new Promise(resolve => setTimeout(resolve, 1e2));
    dispatch(setActiveTool(null))
    if (!isCancelled && result) {
      const { pixelColor } = result;
      dispatch(setPipetteColor(convertToRgb(pixelColor)))
    }
  }

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