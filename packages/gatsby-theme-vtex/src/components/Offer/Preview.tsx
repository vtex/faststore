import React, { FC } from 'react'
import Skeleton from 'react-loading-skeleton'
import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

interface Props {
  variant?: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginBottom: theme.spacing(3),
  },
}))

const OfferPreview: FC<Props> = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Skeleton height={20} />
      <Skeleton height={23} />
      <Skeleton height={20} />
    </div>
  )
}

export default OfferPreview
