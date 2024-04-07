import styled from "styled-components";
import { ActiveTool } from "../../entities/tools/model";

export const MainContainer = styled.main<{ activeTool: ActiveTool }>`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;

  height: 100%;

  background: lightgray;

  cursor: ${(props) =>
    props.activeTool === "pipette" ? "crosshair" : "default"};
`;
