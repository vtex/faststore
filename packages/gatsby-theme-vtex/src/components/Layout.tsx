import React, { FC, Fragment } from 'react'
import Box from '@material-ui/core/Box'
import makeStyles from '@material-ui/styles/makeStyles'
import type { Theme } from '@material-ui/core'

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
}))

const OverMenu = () => {
  const classes = useStyles()

  return (
    <Box
      p={2}
      px={4}
      bgcolor="#02003d"
      minHeight="48px"
      display={['none', 'none', 'flex']}
      style={{
        textDecoration: 'none',
        color: 'muted',
        fontSize: 16,
      }}
    >
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
    </Box>
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
