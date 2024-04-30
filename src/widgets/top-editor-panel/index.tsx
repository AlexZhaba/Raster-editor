import React from "react";
import { Container } from "./style";
import { FileUploader, PipetteButton } from "../../entities/renderer";

import { ResizeButton } from "../../entities/renderer/ui/resize-button";
import { DragButton } from "../../entities/renderer/ui/drag-button";


export const TopEditorPanel: React.FC = () => {

  return (
    <Container>
      <FileUploader />
      <DragButton />
      <PipetteButton />
      <ResizeButton />
    </Container>
  )
}