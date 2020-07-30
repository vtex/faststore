import React, { FC, useState } from 'react'
import type { Theme } from '@material-ui/core'
import {
  useTheme,
  ButtonBase,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core'

import { ProductSummary } from '../ProductSummary'
import { SyncProductItem } from '../../types/product'
import ArrowLeft from './ArrowLeft'
import ArrowRight from './ArrowRight'
import Typography from '../material-ui-components/Typography'
import Grid from '../material-ui-components/Grid'

interface Props {
  syncProducts: SyncProductItem[]
}

// TODO useMediaQuery https://material-ui.com/components/use-media-query/#usemediaquery
// const ARROW_SIZES = [25, 50]
// const MAX_ITEMS = [1, 4]

const hasPrevArrow = (page: number) => page > 0

const hasNextArrow = (
  page: number,
  itemCount: number,
  itemsPerPage: number
) => {
  const lastItemIndex = (page + 1) * itemsPerPage - 1

  return lastItemIndex < itemCount - 1
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  arrow: {
    padding: theme.spacing(1),
  },
}))

// TOOD: Style typography
const Shelf: FC<Props> = ({ syncProducts }) => {
  const [page, setPage] = useState(0)
  const classes = useStyles()
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const maxItems = upSm ? 4 : 1
  const arrowSize = upSm ? 50 : 25

  const items =
    maxItems > 1
      ? syncProducts.slice(page * maxItems, (page + 1) * maxItems)
      : [syncProducts[page]]

  return (
    <div className={classes.root}>
      <Grid justify="center" container>
        <Typography variant="h2" component="h2">
          summer
        </Typography>
      </Grid>
      <Grid container spacing={1}>
        <Grid container alignItems="center" justify="center" xs={1}>
          {hasPrevArrow(page) && (
            <ButtonBase
              className={classes.arrow}
              onClick={() => setPage(page - 1)}
              aria-label="See shelf previous page"
            >
              <ArrowLeft size={arrowSize} />
            </ButtonBase>
          )}
        </Grid>
        <Grid item container xs spacing={2}>
          {items.map((item) => {
            return (
              <Grid key={item.id} item xs={maxItems > 1 ? 3 : 'auto'}>
                <ProductSummary syncProduct={item} />
              </Grid>
            )
          })}
        </Grid>
        <Grid container alignItems="center" justify="center" xs={1}>
          {hasNextArrow(page, syncProducts.length, maxItems) && (
            <ButtonBase
              className={classes.arrow}
              onClick={() => {
                setPage(page + 1)
              }}
              aria-label="See shelf next page"
            >
              <ArrowRight size={arrowSize} />
            </ButtonBase>
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default Shelf
