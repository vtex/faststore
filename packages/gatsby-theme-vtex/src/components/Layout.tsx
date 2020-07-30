import React, { FC, Fragment } from 'react'
import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

import Header from './Header'
import NotificationBar from './NotificationBar'
import Grid from './material-ui-components/Grid'
import Link from './material-ui-components/Link'

const useStyles = makeStyles((theme: Theme) => ({
  link: {
    color: theme.palette.grey['50'],
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.grey['500'],
    },
  },
  rightMenu: {
    display: 'flex',
  },
  root: {
    backgroundColor: '#02003d',
    minHeight: '48px',
    textDecoration: 'none',
    color: theme.palette.grey[300],
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
}))

const OverMenu = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid item container alignItems="center" justify="center" spacing={5}>
        <Grid item>
          <Link className={classes.link} to="/">
            Shop
          </Link>
        </Grid>
        <Grid item>
          <Link className={classes.link} to="/about">
            About us
          </Link>
        </Grid>
        <Grid item style={{ flexGrow: 1 }} />
        <Grid item>
          <a className={classes.link} href="https://vtex.com">
            visit vtex.com
          </a>
        </Grid>
      </Grid>
    </div>
  )
}

const Layout: FC = ({ children }) => (
  <Fragment>
    <NotificationBar text="SELECTED ITEMS ON SALE! CHECK IT OUT!" />
    <OverMenu />
    <Header />
    {children}
    <footer>© {new Date().getFullYear()}, Built with Gatsby and VTEX</footer>
  </Fragment>
)

export default Layout
