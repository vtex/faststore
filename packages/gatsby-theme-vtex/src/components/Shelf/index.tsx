import React, { FC, useState } from 'react'
import Box from '@material-ui/core/Box'
import { useResponsiveValue } from '@theme-ui/match-media'

import { ProductSummary } from '../ProductSummary'
import { SyncProductItem } from '../../types/product'
import ArrowLeft from './ArrowLeft'
import ArrowRight from './ArrowRight'
import Button from '../material-ui-components/Button'
import Typography from '../material-ui-components/Typography'
import Grid from '../material-ui-components/Grid'

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

// TOOD: Style typography
const Shelf: FC<Props> = ({ syncProducts }) => {
  const [page, setPage] = useState(0)
  const maxItems = useResponsiveValue(MAX_ITEMS)
  const arrowSize = useResponsiveValue(ARROW_SIZES)

  const items =
    maxItems > 1
      ? syncProducts.slice(page * maxItems, (page + 1) * maxItems)
      : [syncProducts[page]]

  return (
    <Box display="flex">
      <Grid justify="center" container>
        <Typography component="h2">summer</Typography>
      </Grid>
      <Grid container>
        <Grid container alignItems="center" xs={1}>
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
        </Grid>
        <Grid item container xs spacing={2}>
          {items.map((item) => {
            return (
              <Grid key={item.id} item xs={maxItems > 1 ? 3 : 1}>
                <ProductSummary syncProduct={item} />
              </Grid>
            )
          })}
        </Grid>
        <Grid container alignItems="center" xs={1}>
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
        </Grid>
      </Grid>
    </Box>
  )
}

export default Shelf
