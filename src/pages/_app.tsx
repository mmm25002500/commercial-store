import '@/styles/globals.css'
import { ThemeProvider } from 'next-themes';
import Layout from '@/components/Layout';
import type { AppProps } from 'next/app'
import '../config/firebase';
import { Toaster } from 'react-hot-toast';

import { config } from '@fortawesome/fontawesome-svg-core'

config.autoAddCss = false;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider attribute="class">
      <Layout>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default App;