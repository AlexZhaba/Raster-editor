import { Provider as ReduxProvider } from "react-redux";
import styled from "styled-components";
import "./app.css";
import { store } from "./app/store";
import { Editor } from "./pages/editor";

const AppWrapper = styled.div`
  width: 100%;
  height: 100vh;
`;

const App = () => (
  <ReduxProvider store={store}>
    <AppWrapper>
      <Editor />
    </AppWrapper>
  </ReduxProvider>
);

export default App;
