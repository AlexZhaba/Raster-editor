import styled from 'styled-components';
import './App.css';
import { Editor } from './pages/editor';

const AppWrapper = styled.div`
  width: 100%;
  height: 100vh;

  /* background: blue; */
`

const App = () => (
  <AppWrapper>
    <Editor />
  </AppWrapper>
);

export default App;
