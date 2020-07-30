import React, { FC } from 'react'
import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

import Typography from './material-ui-components/Typography'

interface Props {
  text: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: theme.spacing(6),
    backgroundColor: '#e0efe0',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  typo: {
    textDecoration: 'underline',
  },
}))

const NotificationBar: FC<Props> = ({ text }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography className={classes.typo} color="primary" variant="button">
        {text}
      </Typography>
    </div>
  )
}

export default NotificationBar
