import { BrowserRouter } from "react-router-dom";
import GlobalStyles from "~/components/globalStyles";
import { GlobalDataProvider } from "~/hooks/globalData";
import AppRouter from "~/router";
import 'react-quill/dist/quill.snow.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <GlobalDataProvider>
      <BrowserRouter>
        <GlobalStyles >
          <AppRouter />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            limit={1}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="light"
          />
        </GlobalStyles>
      </BrowserRouter>
    </GlobalDataProvider>
  )
}

export default App
