import React, { FC, useState } from 'react'
import { Flex, Grid, Button, Box, Heading } from 'theme-ui'
import { useResponsiveValue } from '@theme-ui/match-media'

import { ProductSummary } from '../ProductSummary'
import ArrowLeft from './ArrowLeft'
import ArrowRight from './ArrowRight'
import { ProductSummary_SyncProductFragment } from '../__generated__/ProductSummary_syncProduct.graphql'

interface Props {
  products: Array<ProductSummary_SyncProductFragment | undefined | null>
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

const Shelf: FC<Props> = ({ products }) => {
  const [page, setPage] = useState(0)
  const maxItems = useResponsiveValue(MAX_ITEMS)
  const arrowSize = useResponsiveValue(ARROW_SIZES)

  const items =
    maxItems > 1
      ? products.slice(page * maxItems, (page + 1) * maxItems)
      : [products[page]]

  return (
    <Box>
      <Flex p={2} sx={{ justifyContent: 'center' }} marginY={[16, 30]}>
        <Heading variant="shelfTitle" as="h2">
          summer
        </Heading>
      </Flex>
      <Flex>
        <Flex sx={{ alignItems: 'center' }}>
          {hasPrevArrow(page) && (
            <Button
              backgroundColor="transparent"
              onClick={() => setPage(page - 1)}
              aria-label="See shelf previous page"
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
                    <Flex key={item!.productId!} sx={{ flexGrow: 1 }}>
                      <ProductSummary product={item!} />
                    </Flex>
                  )
                })}
              </Grid>
            </FullWidthContainer>
            <Flex sx={{ alignItems: 'center' }}>
              {hasNextArrow(page, products.length, maxItems) && (
                <Button
                  backgroundColor="transparent"
                  onClick={() => {
                    setPage(page + 1)
                  }}
                  aria-label="See shelf next page"
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
