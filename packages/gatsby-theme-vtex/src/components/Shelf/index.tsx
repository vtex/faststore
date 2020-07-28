import React, { FC, useState } from 'react'
import { Flex, Grid, Box, Heading } from 'theme-ui'
import { useResponsiveValue } from '@theme-ui/match-media'

import { ProductSummary } from '../ProductSummary'
import { SyncProductItem } from '../../types/product'
import ArrowLeft from './ArrowLeft'
import ArrowRight from './ArrowRight'
import Button from '../material-ui-components/Button'

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
      <Flex p={2} sx={{ justifyContent: 'center' }} marginY={[16, 30]}>
        <Heading variant="shelfTitle" as="h2">
          summer
        </Heading>
      </Flex>
      <Flex>
        <Flex sx={{ alignItems: 'center' }}>
          {hasPrevArrow(page) && (
            <Button
              style={{
                backgroundColor: 'transparent',
              }}
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
                  style={{
                    backgroundColor: 'transparent',
                  }}
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
