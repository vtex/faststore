import '@faststore/ui/src/styles/global.scss'
import './custom-nextra.css'
import type { AppProps } from 'next/app'
import type { ReactElement } from 'react'

export default function Nextra({
  Component,
  pageProps,
}: AppProps): ReactElement {
  return <Component {...pageProps} />
}
