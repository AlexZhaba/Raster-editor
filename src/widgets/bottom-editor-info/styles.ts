import styled from "styled-components";

export const FooterContainer = styled.footer`
  background: white;
  height: 40px;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
`;

export const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Coordinates = styled.div`
  width: 200px;
  padding: 0 20px;
`;

export const Tools = styled.div`
  padding: 0 20px;

  min-width: 200px;

  border-right: 1px solid black;
`;

export const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
