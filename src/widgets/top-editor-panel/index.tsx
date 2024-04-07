import React from "react";
import { Container } from "./style";
import { FileUploader, PipetteButton } from "../../entities/renderer";


export const TopEditorPanel: React.FC = () => {

  return (
    <Container>
      <FileUploader />
      <PipetteButton />
    </Container>
  )
}