import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider as AppContextProvider } from '../contexts/app'
import { Provider as AuthContextProvider } from '../contexts/auth'

export default function App({ Component, pageProps }: AppProps) {

  return (
    <AuthContextProvider>
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </AuthContextProvider>
  );

}



