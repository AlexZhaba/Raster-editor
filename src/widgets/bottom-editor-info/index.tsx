
import { InputNumber, Select, Slider } from "antd";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { setScale } from "../../entities/renderer";
import { Coordinates, FooterContainer, Tools, RightContainer, LeftContainer } from "./styles";

export const BottomEditorInfo: React.FC = () => {
  const dispatch = useAppDispatch();

  const color = useAppSelector(state => state.toolSlice.pipetteColor)
  const cursorX = useAppSelector(state => state.canvasSlice.cursorX);
  const cursorY = useAppSelector(state => state.canvasSlice.cursorY);
  const canvasSize = useAppSelector(state => state.canvasSlice.canvasSize)
  const isCanvasEmpty = useAppSelector(state => state.canvasSlice.isCanvasEmpty)
  const scaleInPercent = useAppSelector(state => state.canvasSlice.scaleInPercent)

  const handleScaleChange = (value: number) => {
    dispatch(setScale(value))
  }


  return (
    <FooterContainer>
      <LeftContainer>
        <div>Canvas size: {canvasSize.width ?? 0}x{canvasSize.height ?? 0}</div>
        <Tools>
          <div style={{ width: 20, height: 20, background: color ?? 'black' }}></div>
        </Tools>
        <Coordinates>Coord: {cursorX ?? '-'} : {cursorY ?? '-'}</Coordinates>
      </LeftContainer>
      {!isCanvasEmpty && (
        <RightContainer>
          <span>
            Scale:
          </span>
          <div style={{ flex: 1 }}>
            <Select
              options={[{ value: 20, label: 20 }, { value: 50, label: 50 }, { value: 75, label: 75 }, { value: 100, label: 100 }, { value: 150, label: 150 }, { value: 250, label: 250 }, { value: 300, label: 300 }]}
              onChange={handleScaleChange}
              value={scaleInPercent} />
          </div>
          <InputNumber placeholder={"scale at %"} max={500} min={20} />
        </RightContainer>
      )}
    </FooterContainer>
  )
}