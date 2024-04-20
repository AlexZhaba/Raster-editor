import React from "react";
import { Container } from "./style";
import { FileUploader, PipetteButton } from "../../entities/renderer";

import { ResizeButton } from "./ui/resize-button";


export const TopEditorPanel: React.FC = () => {

  return (
    <Container>
      <FileUploader />
      <PipetteButton />
      <ResizeButton />
    </Container>
  )
}