import React, { FC } from 'react'

import { SyncProductCommertialOffer } from '../../types/product'
import Grid from '../material-ui-components/Grid'

interface Props {
  offer: SyncProductCommertialOffer
  variant: string
}

// TODO: Style variant
const DiscountPercentage: FC<Props> = ({ offer, variant }) => {
  if (offer.Price === offer.ListPrice) {
    return null
  }

  const relation = Math.round((offer.Price / offer.ListPrice) * 100)
  const discount = 100 - relation

  return <Grid item>-{discount}%</Grid>
}

export default DiscountPercentage
