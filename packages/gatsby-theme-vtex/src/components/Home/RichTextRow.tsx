import React, { FC } from 'react'
import { Box, Flex, Grid, RichMarkdown } from '@vtex/store-ui'

import freeShippingHtml from '../../markdowns/free-shipping.md'
import deliveryHtml from '../../markdowns/delivery.md'
import pickupHtml from '../../markdowns/pickup.md'
import dealHtml from '../../markdowns/deal.md'
import { scaleFileManagerImage } from '../../sdk/img/fileManager'

const FullWidthContainer: FC = ({ children }) => (
  <Box sx={{ width: '100%' }}>{children}</Box>
)

const MAX_ITEMS = [1, 4]

const RichTextRow: FC = () => {
  return (
    <FullWidthContainer>
      <Box backgroundColor="#a7afbd">
        <Grid gap={2} columns={MAX_ITEMS}>
          <Flex
            variant="deal-row-item-container"
            sx={{
              alignItems: 'center',
              flexDirection: 'column',
              paddingY: '0.5rem',
            }}
          >
            <img
              src={scaleFileManagerImage(
                'https://storecomponents.vtexassets.com/arquivos/box.png',
                24,
                24
              )}
              width="24px"
              height="24px"
              alt="shipping box"
            />
            <RichMarkdown text={freeShippingHtml} variant="deals-row" />
          </Flex>
          <Flex
            variant="deal-row-item-container"
            sx={{
              alignItems: 'center',
              flexDirection: 'column',
              paddingY: '0.5rem',
            }}
          >
            <img
              src={scaleFileManagerImage(
                'https://storecomponents.vtexassets.com/arquivos/delivery-fast.png',
                24,
                24
              )}
              width="24px"
              height="24px"
              alt="delivery"
            />
            <RichMarkdown text={deliveryHtml} variant="deals-row" />
          </Flex>
          <Flex
            variant="deal-row-item-container"
            sx={{
              alignItems: 'center',
              flexDirection: 'column',
              paddingY: '0.5rem',
            }}
          >
            <img
              src={scaleFileManagerImage(
                'https://storecomponents.vtexassets.com/arquivos/store.png',
                24,
                24
              )}
              width="24px"
              height="24px"
              alt="store"
            />
            <RichMarkdown text={pickupHtml} variant="deals-row" />
          </Flex>
          <Flex
            variant="deal-row-item-container"
            sx={{
              alignItems: 'center',
              flexDirection: 'column',
              paddingY: '0.5rem',
            }}
          >
            <img
              src={scaleFileManagerImage(
                'https://storecomponents.vtexassets.com/arquivos/coupon.png',
                24,
                24
              )}
              width="24px"
              height="24px"
              alt="coupon"
            />
            <RichMarkdown text={dealHtml} variant="deals-row" />
          </Flex>
        </Grid>
      </Box>
    </FullWidthContainer>
  )
}

export default RichTextRow
