import type { AppProps } from 'next/app.js'
import { EpilepsyWarning } from '../components/layout/EpilepsyWarning.jsx'
import { NextHead } from '../components/next/Head.js'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
      </NextHead>

      <Component {...pageProps} />

      <EpilepsyWarning />
    </>
  )
}
