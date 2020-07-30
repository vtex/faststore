import React, { FC } from 'react'
import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    marginTop: theme.spacing(3),
  },
  root: {
    margin: '0 auto',
    width: '100%',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '96rem',
    },
  },
}))

const Container: FC = ({ children }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <main className={classes.main}>{children}</main>
    </div>
  )
}

export default Container
