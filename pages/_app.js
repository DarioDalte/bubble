import "../styles/globals.css";
import { Provider } from "next-auth/client";
import { Provider as ReduxProvider } from "react-redux";
import  store  from "../app/store/store";

function App({ Component, pageProps }) {
  return (
    <ReduxProvider store={store}>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </ReduxProvider>
  );
}

export default App;
