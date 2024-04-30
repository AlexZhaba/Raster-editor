import React from "react";
import { Container, ToolList } from "./style";
import { FileUploader } from "../../entities/renderer";

import { ResizeButton } from "../../entities/renderer/ui/resize-button";
import { DragButton, PipetteButton, PipettePanel } from "../../entities/tools/ui";


export const TopEditorPanel: React.FC = () => {

  return (
    <Container>
      <FileUploader />
      <ToolList>
        <DragButton />
        <PipetteButton />
        <PipettePanel />
      </ToolList>
      <ResizeButton />
    </Container>
  )
}