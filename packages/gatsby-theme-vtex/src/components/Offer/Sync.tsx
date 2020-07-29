import React, { FC, useMemo } from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/styles'
import type { Theme } from '@material-ui/core'

import { useNumberFormat } from '../../providers/NumberFormat'
import { findBestSeller, Item } from '../../utils/seller'
import DiscountPercentage from './DiscountPercentage'
import ListPrice from './ListPrice'
import Grid from '../material-ui-components/Grid'
import Typography from '../material-ui-components/Typography'

export interface Props {
  sku?: Item
  variant?: string
}

const useStyles = makeStyles((theme: Theme) => ({
  priceRoot: {
    color: theme.palette.text.primary,
    marginRight: theme.spacing(1),
  },
  typographyh6: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  typographyBody2: {
    color: theme.palette.text.secondary,
  },
  box: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
}))

const SyncOffer: FC<Props> = ({ sku, variant = '' }) => {
  const seller = useMemo(() => sku && findBestSeller(sku), [sku])
  const offer = seller?.commertialOffer
  const numberFormat = useNumberFormat()
  const classes = useStyles()

  if (!offer || offer.AvailableQuantity === 0) {
    return <Typography>Product Unavailable</Typography>
  }

  return (
    <Box className={classes.box}>
      <ListPrice variant={variant} offer={offer} />
      <Grid container xs alignItems="center">
        <Typography
          variant="h6"
          classes={{
            root: classes.priceRoot,
            h6: classes.typographyh6,
          }}
        >
          {numberFormat.format(offer.Price)}
        </Typography>
        <DiscountPercentage variant={variant} offer={offer} />
      </Grid>
      <Typography
        variant="body2"
        classes={{
          body2: classes.typographyBody2,
        }}
      >
        {offer.AvailableQuantity} units left!
      </Typography>
    </Box>
  )
}

export default SyncOffer
