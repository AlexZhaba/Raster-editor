import React from "react";
import { CANVAS_ROOT_ID } from "../../entities/canvas/model";

import { CanvasContainer } from "./styles";


export const Canvas: React.FC = () => {
  return (
    <CanvasContainer id={CANVAS_ROOT_ID}>
    </CanvasContainer>
  )
}