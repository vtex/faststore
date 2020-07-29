import React, { FC } from 'react'
import { Box, Flex, Grid } from 'theme-ui'
import RichMarkdown from '../RichText/RichMarkdown'

import freeShippingHtml from '../../markdowns/free-shipping.md'
import deliveryHtml from '../../markdowns/delivery.md'
import pickupHtml from '../../markdowns/pickup.md'
import dealHtml from '../../markdowns/deal.md'
import { scaleImage } from '../../utils/img'

const FullWidthContainer: FC = ({ children }) => (
  <Box sx={{ width: '100%' }}>{children}</Box>
)

const MAX_ITEMS = [1, 4]

const RichTextRow: FC = () => {
  return (
    <FullWidthContainer>
      <Box backgroundColor="#a7afbd" >
        <Grid gap={2} columns={MAX_ITEMS}>
          <Flex variant="deal-row-item-container" sx={{ alignItems: 'center', flexDirection: 'column', paddingY: '0.5rem' }}>
            <img
              src={scaleImage('https://storecomponents.vtexassets.com/arquivos/box.png', 24, 24)}
              width={`24px`}
              height={`24px`}
            />
            <RichMarkdown text={freeShippingHtml} variant="deals-row" />
          </Flex>
          <Flex variant="deal-row-item-container" sx={{ alignItems: 'center', flexDirection: 'column', paddingY: '0.5rem' }}>
            <img
              src={scaleImage('https://storecomponents.vtexassets.com/arquivos/delivery-fast.png', 24, 24)}
              width={`24px`}
              height={`24px`}
            />
            <RichMarkdown text={deliveryHtml} variant="deals-row" />
          </Flex>
          <Flex variant="deal-row-item-container" sx={{ alignItems: 'center', flexDirection: 'column', paddingY: '0.5rem' }}>
            <img
              src={scaleImage('https://storecomponents.vtexassets.com/arquivos/store.png', 24, 24)}
              width={`24px`}
              height={`24px`}
            />
            <RichMarkdown text={pickupHtml} variant="deals-row" />
          </Flex>
          <Flex variant="deal-row-item-container" sx={{ alignItems: 'center', flexDirection: 'column', paddingY: '0.5rem' }}>
            <img
              src={scaleImage('https://storecomponents.vtexassets.com/arquivos/coupon.png', 24, 24)}
              width={`24px`}
              height={`24px`}
            />
            <RichMarkdown text={dealHtml} variant="deals-row" />
          </Flex>
        </Grid>
      </Box>
    </FullWidthContainer>
  )
}

export default RichTextRow
