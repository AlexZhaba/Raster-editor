import styled from "styled-components";

const ModalContainer = styled.div``;

const HistorgramContainer = styled.div`
  width: 400px;
  height: 400px;
`;

const ButtonGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-rows: 30px 30px;
  grid-gap: 10px;
  grid-template-columns: 100px 100px 100px;
`;

export { ModalContainer, HistorgramContainer, ButtonGrid };
