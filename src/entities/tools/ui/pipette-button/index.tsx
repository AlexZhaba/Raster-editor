import { PushpinFilled } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React, { MouseEventHandler, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../app/store";
import { setActiveTool, startPipetteClick, stopPipetteClick } from "../../model";
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
    dispatch(startPipetteClick())
  }

  return (
    <Container>
      <Tooltip title="Get canvas color">
        <Button
          shape="round"
          icon={<PushpinFilled />}
          onClick={onPipetteClick}
          disabled={isCanvasEmpty}
          type={isPipetteAction ? 'primary' : 'dashed'}
        >
          Pipette
        </Button>
      </Tooltip>
    </Container>
  )
}