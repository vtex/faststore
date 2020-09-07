/** @jsx jsx */
import { FC, Fragment } from 'react'
import { Flex, Grid, Box, Heading, useSlider, jsx } from '@vtex/store-ui'
import { useResponsiveValue } from '@theme-ui/match-media'

import { ProductSummary } from '../ProductSummary'
import ArrowLeft from './ArrowLeft'
import ArrowRight from './ArrowRight'
import { ProductSummary_SyncProductFragment } from '../__generated__/ProductSummary_syncProduct.graphql'
import PaginationDots from './PaginationDots'

interface Props {
  products: Array<ProductSummary_SyncProductFragment | undefined | null>
  showArrows?: boolean
  showDots?: boolean
  autoplay?: boolean
  autoplayTimeout?: number
}

const PAGE_SIZES = [1, 4]

const FullWidthContainer: FC = ({ children }) => (
  <Box sx={{ width: '100%' }}>{children}</Box>
)

const Shelf: FC<Props> = ({
  products,
  showArrows = true,
  showDots = true,
  autoplay = false,
  autoplayTimeout = 1e3,
}) => {
  const pageSize = useResponsiveValue(PAGE_SIZES, { defaultIndex: 1 })
  const {
    page,
    items,
    totalPages,
    setPage,
    setNextPage,
    setPreviousPage,
  } = useSlider({
    allItems: products,
    autoplayTimeout,
    autoplay,
    pageSize,
  })

  return (
    <Fragment>
      <Flex p={2} sx={{ justifyContent: 'center' }} marginY={[16, 30]}>
        <Heading variant="shelfTitle" as="h2">
          summer
        </Heading>
      </Flex>
      <Flex>
        {showArrows && <ArrowLeft onClick={() => setPreviousPage()} />}
        <FullWidthContainer>
          <Flex sx={{ justifyContent: 'center' }}>
            <FullWidthContainer>
              <Grid gap={2} columns={PAGE_SIZES}>
                {items.map((item) => {
                  return (
                    <Flex key={item!.productId!} sx={{ flexGrow: 1 }}>
                      <ProductSummary product={item!} />
                    </Flex>
                  )
                })}
              </Grid>
            </FullWidthContainer>
          </Flex>
        </FullWidthContainer>
        {showArrows && <ArrowRight onClick={() => setNextPage()} />}
      </Flex>
      {showDots && (
        <PaginationDots
          variant="shelf"
          onSelect={setPage}
          selectedPage={page}
          totalPages={totalPages}
        />
      )}
    </Fragment>
  )
}

export default Shelf
