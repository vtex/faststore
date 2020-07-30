import React, { FC, Fragment } from 'react'
import { Box } from '@material-ui/core'

import Action from '../InfoCard/ButtonAction'
import RichText from '../RichText'
import InfoCard from '../InfoCard'

const Block: FC = ({ children }) => <Box marginY="64px">{children}</Box>

const Fold: FC = () => (
  <Fragment>
    <Block>
      <InfoCard
        to="/vintage-phone/p"
        headline="New Promotion!"
        imgSrc="https://storecomponents.vtexassets.com/assets/faststore/images/banner-infocard2___3f284742ba9ede3826bc0721f0789694.png?height=300&aspect=true"
        imgAlt="infocard-banner"
      >
        <Box pt={1}>
          <Action to="/vintage-phone/p" label="BUY NOW" />
        </Box>
      </InfoCard>
    </Block>

    <Block>
      <RichText
        text="This is an example store built using the VTEX platform."
        variant="question"
      />
      <RichText text="Want to know more?" variant="question" />
    </Block>

    <Block>
      <Box style={{ marginBottom: '16px' }}>
        <RichText text="Reach us at" />
      </Box>
      <a href="www.vtex.com.br">
        <RichText text="www.vtex.com.br" variant="link" />
      </a>
    </Block>
  </Fragment>
)

export default Fold
