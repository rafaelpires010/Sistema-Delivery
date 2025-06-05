import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider as AppContextProvider } from '../contexts/app'
import { Provider as AuthContextProvider } from '../contexts/auth'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    document.body.style.backgroundColor = window.innerWidth >= 1024 ? '#F9F9FB' : '#FFF';
  }, []);

  return (
    <AuthContextProvider>
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </AuthContextProvider>
  );

}



