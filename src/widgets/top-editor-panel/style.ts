import { styled } from "styled-components";

export const Container = styled.div`
  padding: 6px 18px;
  border: 1px solid black;
  background: white;

  height: 40px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ToolList = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  gap: 16px;
  margin: 0 20px;
  padding: 0 16px;

  border-left: 1px solid black;
  border-right: 1px solid black;
`;
