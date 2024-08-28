
import { InputNumber, Select } from "antd";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { setScale } from "../../entities/renderer";
import { Coordinates, FooterContainer, Tools, RightContainer, LeftContainer } from "./styles";
import { ColorPreview } from "../../shared/ui/color-preview";

export const BottomEditorInfo: React.FC = () => {
  const dispatch = useAppDispatch();

  const color = useAppSelector(state => state.toolSlice.pipetteColor)
  const metaInfo = useAppSelector(state => state.toolSlice.pipetteMetaInfo)
  const cursorX = useAppSelector(state => state.canvasSlice.cursorX);
  const cursorY = useAppSelector(state => state.canvasSlice.cursorY);
  const canvasSize = useAppSelector(state => state.canvasSlice.canvasSize)
  const imagesSize = useAppSelector(state => state.canvasSlice.imagesSize);
  const isCanvasEmpty = useAppSelector(state => state.canvasSlice.isCanvasEmpty)
  const scaleInPercent = useAppSelector(state => state.canvasSlice.scaleInPercent)

  const handleScaleChange = (value: number | null) => {
    dispatch(setScale(value ?? 0))
  };


  return (
    <FooterContainer>
      <LeftContainer>
        <div>Image size: {imagesSize.width ?? 0}x{imagesSize.height ?? 0}</div>
        <div>Canvas size: {canvasSize.width ?? 0}x{canvasSize.height ?? 0}</div>
        {color && !isCanvasEmpty && (
          <>
            <Tools>
              <ColorPreview color={color} showMeta={true} />
            </Tools>
            ImageCord: {metaInfo.imageX}x{metaInfo.imageY}
          </>
        )}
        <Coordinates>Coord: {cursorX ?? '-'} : {cursorY ?? '-'}</Coordinates>
      </LeftContainer>
      {!isCanvasEmpty && (
        <RightContainer>
          <span>
            Scale %
          </span>
          <Select
            options={[{ value: 20, label: 20 }, { value: 50, label: 50 }, { value: 75, label: 75 }, { value: 100, label: 100 }, { value: 150, label: 150 }, { value: 250, label: 250 }, { value: 300, label: 300 }]}
            onChange={handleScaleChange}
            value={scaleInPercent} />
          <InputNumber
            placeholder={"scale at %"}
            max={500}
            min={20}
            value={scaleInPercent}
            onChange={handleScaleChange}
          />
        </RightContainer>
      )}
    </FooterContainer>
  )
}