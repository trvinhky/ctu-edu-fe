import { BrowserRouter } from "react-router-dom";
import GlobalStyles from "~/components/globalStyles";
import { GlobalDataProvider } from "~/hooks/globalData";
import AppRouter from "~/router";
import 'react-quill/dist/quill.snow.css';

function App() {
  return (
    <GlobalDataProvider>
      <BrowserRouter>
        <GlobalStyles >
          <AppRouter />
        </GlobalStyles>
      </BrowserRouter>
    </GlobalDataProvider>
  )
}

export default App
