import React, { FC } from 'react'
// import { makeStyles } from '@material-ui/core/styles'

import { SyncProductCommertialOffer } from '../../types/product'
import Grid from '../material-ui-components/Grid'
import Typography from '../material-ui-components/Typography'

interface Props {
  offer: SyncProductCommertialOffer
  variant: string
}

// const useStyles = makeStyles(() => ({}))

// TODO: Style variant
const DiscountPercentage: FC<Props> = ({ offer }) => {
  // const classes = useStyles()

  if (offer.Price === offer.ListPrice) {
    return null
  }

  const relation = Math.round((offer.Price / offer.ListPrice) * 100)
  const discount = 100 - relation

  return (
    <Grid item>
      <Typography>-{discount}%</Typography>
    </Grid>
  )
}

export default DiscountPercentage
