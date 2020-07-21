/** @jsx jsx */
import { FC, Fragment } from 'react'
import { jsx } from 'theme-ui'

import Action from '../InfoCard/ButtonAction'
import RichText from '../RichText'
import InfoCard from '../InfoCard'

const Block: FC = ({ children }) => <div sx={{ my: 5 }}>{children}</div>

const Fold: FC = () => (
  <Fragment>
    <Block>
      <InfoCard
        to="/vintage-phone/p"
        headline="New Promotion!"
        imgSrc="https://storecomponents.vtexassets.com/assets/faststore/images/banner-infocard2___3f284742ba9ede3826bc0721f0789694.png?height=300&aspect=true"
        imgAlt="infocard-banner"
      >
        <div sx={{ my: 3 }}>
          <Action to="/vintage-phone/p" label="BUY NOW" />
        </div>
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
      <div sx={{ mb: 3 }}>
        <RichText text="Reach us at" />
      </div>
      <a href="www.vtex.com.br">
        <RichText text="www.vtex.com.br" variant="link" />
      </a>
    </Block>
  </Fragment>
)

export default Fold
