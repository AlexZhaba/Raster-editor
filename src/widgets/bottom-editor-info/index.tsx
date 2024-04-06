
import React from "react";
import { useAppSelector } from "../../app/store";
import { FooterContainer } from "./styles";

export const BottomEditorInfo: React.FC = () => {
  const color = useAppSelector(state => state.toolSlice.pipetteColor)

  return (
    <FooterContainer>
      <div style={{ width: 20, height: 20, background: color ?? 'black' }}></div>
    </FooterContainer>
  )
}