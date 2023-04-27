import type { AppProps } from 'next/app'
import type { ReactElement } from 'react'
import '../styles/custom-nextra.css'
import '../styles/global.scss'

export default function Nextra({
  Component,
  pageProps,
}: AppProps): ReactElement {
  return <Component {...pageProps} />
}
