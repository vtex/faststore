import { Card, CardImage, CardInfo, CardInfoAction } from '@vtex/store-ui'
import React, { FC, Fragment } from 'react'
import { Box } from 'theme-ui'

import RichText from '../RichText'

const Block: FC = ({ children }) => <Box sx={{ my: 5 }}>{children}</Box>

const Fold: FC = () => {
  return (
    <Fragment>
      <Block>
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
      </Block>

      <Block>
        <RichText
          text="This is an example store built using the VTEX platform."
          variant="question"
        />
        <RichText text="Want to know more?" variant="question" />
      </Block>

      <Block>
        <div sx={{ mb: 3 }}>
          <RichText text="Reach us at" />
        </div>
        <a href="www.vtex.com.br">
          <RichText text="www.vtex.com.br" variant="link" />
        </a>
      </Block>
    </Fragment>
  )
}

export default Fold
