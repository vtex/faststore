import React, { FC } from 'react'
import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

import Typography from '../material-ui-components/Typography'
import { SyncProductCommertialOffer } from '../../types/product'

interface Props {
  offer: SyncProductCommertialOffer
  variant: string
}

const useStyles = makeStyles((theme: Theme) => ({
  discountBadge: {
    borderRadius: '1000px',
    color: 'white',
    padding: `0 ${theme.spacing(1)}px`,
    backgroundColor: 'rgb(7, 123, 11)',
  },
}))

// TODO: Style variant
const DiscountPercentage: FC<Props> = ({ offer }) => {
  const classes = useStyles()

  if (offer.Price === offer.ListPrice) {
    return null
  }

  const relation = Math.round((offer.Price / offer.ListPrice) * 100)
  const discount = 100 - relation

  return (
    <Typography
      classes={{
        root: classes.discountBadge,
      }}
      component="span"
      variant="body2"
    >
      -{discount}%
    </Typography>
  )
}

export default DiscountPercentage
