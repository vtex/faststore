import React from 'react'
import { ThemeProvider } from 'theme-ui'

import baseTheme from '../theme'
import CardImage from './Image'
import Card from './index'
import CardInfo from './Info'
import CardInfoAction from './InfoAction'
import cardTheme from './theme'

export default {
  title: 'Card',
  component: Card,
}

export const Fold = () => (
  <ThemeProvider theme={{ ...baseTheme, ...cardTheme }}>
    <Card>
      <CardInfo title="New Promotion!">
        <CardInfoAction href="/vintage-phone/p" label="BUY NOW" />
      </CardInfo>
      <CardImage
        href="/vintage-phone/p"
        src="https://storecomponents.vtexassets.com/assets/faststore/images/banner-infocard2___3f284742ba9ede3826bc0721f0789694.png?height=300&aspect=true"
        alt="infocard-banner"
      />
    </Card>
  </ThemeProvider>
)
