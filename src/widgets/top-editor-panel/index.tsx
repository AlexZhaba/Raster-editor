import styled from "styled-components";
import React from "react";
import { Container, ToolList } from "./style";
import { FileUploader } from "../../entities/renderer";

import {
  DragButton,
  PipetteButton,
  PipettePanel,
} from "../../entities/tools/ui";
import { ResizeButton, CurveButton } from "../../entities/renderer";
import { FilterButton } from "../../entities/renderer/ui/filter-button";

export const TopEditorPanel: React.FC = () => {
  return (
    <Container>
      <FileUploader />
      <ToolList>
        <DragButton />
        <PipetteButton />
        <PipettePanel />
      </ToolList>
      <ButtonContainer>
        <FilterButton />
        <CurveButton />
        <ResizeButton />
      </ButtonContainer>
    </Container>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`;
