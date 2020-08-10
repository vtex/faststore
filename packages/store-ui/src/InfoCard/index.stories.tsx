import React from 'react'
import { ThemeProvider } from 'theme-ui'

import baseTheme from '../theme'
import InfoCardImage from './Image'
import InfoCard from './index'
import InfoCardInfo from './Info'
import InfoCardInfoAction from './InfoAction'
import infoCardTheme from './theme'

export default {
  title: 'Card',
  component: InfoCard,
}

export const Fold = () => (
  <ThemeProvider theme={{ ...baseTheme, ...infoCardTheme }}>
    <InfoCard>
      <InfoCardInfo title="New Promotion!">
        <InfoCardInfoAction href="/vintage-phone/p" label="BUY NOW" />
      </InfoCardInfo>
      <InfoCardImage
        href="/vintage-phone/p"
        src="https://storecomponents.vtexassets.com/assets/faststore/images/banner-infocard2___3f284742ba9ede3826bc0721f0789694.png?height=300&aspect=true"
        alt="infocard-banner"
      />
    </InfoCard>
  </ThemeProvider>
)
