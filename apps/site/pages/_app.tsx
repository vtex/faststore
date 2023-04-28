import type { AppProps } from 'next/app'
import type { ReactElement } from 'react'

import '../styles/_global.scss'
import '../styles/custom-nextra.css'

export default function Nextra({
  Component,
  pageProps,
}: AppProps): ReactElement {
  return <Component {...pageProps} />
}
