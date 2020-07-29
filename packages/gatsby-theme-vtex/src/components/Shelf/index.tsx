import React, { FC, useState } from 'react'
import { Flex, Grid, Button, Box, Heading } from 'theme-ui'
import { useResponsiveValue } from '@theme-ui/match-media'
import freeShippingHtml from '../../markdowns/free-shipping.md'
import deliveryHtml from '../../markdowns/delivery.md'
import pickupHtml from '../../markdowns/pickup.md'
import dealHtml from '../../markdowns/deal.md'

import { ProductSummary } from '../ProductSummary'
import RichMarkdown from '../RichText/RichMarkdown'
import { SyncProductItem } from '../../types/product'
import ArrowLeft from './ArrowLeft'
import ArrowRight from './ArrowRight'

import { scaleImage } from '../../utils/img'

interface Props {
  syncProducts: SyncProductItem[]
}

const ARROW_SIZES = [25, 50]
const MAX_ITEMS = [1, 4]

const hasPrevArrow = (page: number) => page > 0

const hasNextArrow = (
  page: number,
  itemCount: number,
  itemsPerPage: number
) => {
  const lastItemIndex = (page + 1) * itemsPerPage - 1

  return lastItemIndex < itemCount - 1
}

const FullWidthContainer: FC = ({ children }) => (
  <Box sx={{ width: '100%' }}>{children}</Box>
)

const Shelf: FC<Props> = ({ syncProducts }) => {
  const [page, setPage] = useState(0)
  const maxItems = useResponsiveValue(MAX_ITEMS)
  const arrowSize = useResponsiveValue(ARROW_SIZES)

  const items =
    maxItems > 1
      ? syncProducts.slice(page * maxItems, (page + 1) * maxItems)
      : [syncProducts[page]]

  return (
    <Box>
      {/* <FullWidthContainer>
        <Box backgroundColor="#a7afbd" >
          <Grid gap={2} columns={MAX_ITEMS}>
            <Flex variant="testeVariant" sx={{ alignItems: 'center', flexDirection: 'column', paddingY: '0.5rem' }}>
              <img
                src={scaleImage('https://storecomponents.vtexassets.com/arquivos/box.png', 24, 24)}
                width={`24px`}
                height={`24px`}
              />
              <RichMarkdown text={freeShippingHtml} />
            </Flex>
            <Flex variant="testeVariant" sx={{ alignItems: 'center', flexDirection: 'column', paddingY: '0.5rem' }}>
              <img
                src={scaleImage('https://storecomponents.vtexassets.com/arquivos/delivery-fast.png', 24, 24)}
                width={`24px`}
                height={`24px`}
              />
              <RichMarkdown text={deliveryHtml} />
            </Flex>
            <Flex variant="testeVariant" sx={{ alignItems: 'center', flexDirection: 'column', paddingY: '0.5rem' }}>
              <img
                src={scaleImage('https://storecomponents.vtexassets.com/arquivos/store.png', 24, 24)}
                width={`24px`}
                height={`24px`}
              />
              <RichMarkdown text={pickupHtml} />
            </Flex>
            <Flex variant="testeVariant" sx={{ alignItems: 'center', flexDirection: 'column', paddingY: '0.5rem' }}>
              <img
                src={scaleImage('https://storecomponents.vtexassets.com/arquivos/coupon.png', 24, 24)}
                width={`24px`}
                height={`24px`}
              />
              <RichMarkdown text={dealHtml} />
            </Flex>
          </Grid>
        </Box>
      </FullWidthContainer> */}
      {/* <RichMarkdown text={helloText} /> */}
      <Flex p={2} sx={{ justifyContent: 'center' }} marginY={[16, 30]}>
        <Heading variant="shelfTitle" as="h2">
          summer1
        </Heading>
      </Flex>
      <Flex>
        <Flex sx={{ alignItems: 'center' }}>
          {hasPrevArrow(page) && (
            <Button
              backgroundColor="transparent"
              onClick={() => setPage(page - 1)}
              aria-label={'See shelf previous page'}
            >
              <ArrowLeft size={arrowSize} />
            </Button>
          )}
        </Flex>
        <FullWidthContainer>
          <Flex sx={{ justifyContent: 'center' }}>
            <FullWidthContainer>
              <Grid gap={2} columns={MAX_ITEMS}>
                {items.map((item) => {
                  return (
                    <Flex key={item.id} sx={{ flexGrow: 1 }}>
                      <ProductSummary syncProduct={item} />
                    </Flex>
                  )
                })}
              </Grid>
            </FullWidthContainer>
            <Flex sx={{ alignItems: 'center' }}>
              {hasNextArrow(page, syncProducts.length, maxItems) && (
                <Button
                  backgroundColor="transparent"
                  onClick={() => {
                    setPage(page + 1)
                  }}
                  aria-label={'See shelf next page'}
                >
                  <ArrowRight size={arrowSize} />
                </Button>
              )}
            </Flex>
          </Flex>
        </FullWidthContainer>
      </Flex>
    </Box>
  )
}

export default Shelf
