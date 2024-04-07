
import React from "react";
import { useAppSelector } from "../../app/store";
import { Coordinates, FooterContainer, Tools, RightContainer } from "./styles";

export const BottomEditorInfo: React.FC = () => {
  const color = useAppSelector(state => state.toolSlice.pipetteColor)
  const cursorX = useAppSelector(state => state.canvasSlice.cursorX);
  const cursorY = useAppSelector(state => state.canvasSlice.cursorY);
  const canvasSize = useAppSelector(state => state.canvasSlice.canvasSize)

  return (
    <FooterContainer>
      <div>
        Canvas size: {canvasSize.width ?? 0}x{canvasSize.height ?? 0}
      </div>
      <RightContainer>
        <Tools>
          <div style={{ width: 20, height: 20, background: color ?? 'black' }}></div>
        </Tools>
        <Coordinates>Coord: {cursorX ?? '-'} : {cursorY ?? '-'}</Coordinates>
      </RightContainer>
    </FooterContainer>
  )
}