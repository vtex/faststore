import {
  Box,
  Flex,
  InfoCard,
  InfoCardImage,
  InfoCardInfo,
  InfoCardInfoAction,
  RichMarkdown,
} from '@vtex/store-ui'
import React, { FC, Fragment } from 'react'

import exampleStoreMd from '../../markdowns/example-store.md'
import reachUsMd from '../../markdowns/reach-us.md'

const Block: FC = ({ children }) => <Box sx={{ my: 5 }}>{children}</Box>

const Fold: FC = () => {
  return (
    <Fragment>
      <Block>
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
      </Block>

      <Flex sx={{ justifyContent: 'center' }}>
        <RichMarkdown text={exampleStoreMd} variant="question" />
      </Flex>
      <Block>
        <RichMarkdown text={reachUsMd} variant="link" />
      </Block>
    </Fragment>
  )
}

export default Fold
