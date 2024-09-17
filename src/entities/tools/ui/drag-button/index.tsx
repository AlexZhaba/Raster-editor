import { DragOutlined } from "@ant-design/icons";
import { Button, InputNumber, Tooltip } from "antd";
import React, { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { setActiveTool, setSpeedCoef, startMover, stopMover } from "../../model";
import { MouseChangeStatusHandler } from "../../../../shared/lib/move-insepector";

export const DragButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const isCanvasEmpty = useAppSelector(state => state.canvasSlice.isCanvasEmpty)
  const activeTool = useAppSelector(store => store.toolSlice.activeTool?.name);
  const isDragAction = useMemo(() => activeTool === 'mover', [activeTool])

  const dragSpeed = useAppSelector(state => state.toolSlice.dragSpeedCoef)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onMoveAction: MouseChangeStatusHandler = (status) => {
    dispatch(
      setActiveTool(
        { name: 'mover', 'state': status === 'start' ? 'grabbing' : 'wait' },
      )
    );
  }

  const onSpeedChange = (value: number | null) => {
    if (!value) return;
    dispatch(setSpeedCoef(value))
  }

  const handleButtonClick = useCallback(() => {
    if (activeTool === 'mover') {
      dispatch(stopMover());
      return;
    }
    dispatch(setActiveTool({
      name: 'mover',
      state: 'wait'
    }))
    dispatch(startMover(onMoveAction));
  }, [activeTool, dispatch, onMoveAction])

  return (
    <div className="">
      <Tooltip title="Move image">
        <Button
          shape="round"
          icon={<DragOutlined />}
          onClick={handleButtonClick}
          disabled={isCanvasEmpty}
          type={isDragAction ? 'primary' : 'dashed'}
        >
          Drag
        </Button>
      </Tooltip>
      {isDragAction && (
        <InputNumber value={dragSpeed} onChange={onSpeedChange} />
      )}
    </div>
  )
}