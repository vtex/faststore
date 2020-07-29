import React, { FC } from 'react'
import makeStyles from '@material-ui/styles/makeStyles'
import type { Theme } from '@material-ui/core'

import Logo from './Logo'
import Search from './Search'
import Minicart from './Minicart'
import Menu from './Menu'
import Grid from './material-ui-components/Grid'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.grey['200'],
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  rightMenu: {
    display: 'flex',
  },
}))

// TODO: Style
const Header: FC = () => {
  const classes = useStyles()

  return (
    <Grid
      classes={classes}
      component="header"
      container
      alignItems="center"
      justify="space-between"
    >
      <Grid item container sm>
        <Logo />
        <Menu />
      </Grid>
      <Grid
        classes={{
          root: classes.rightMenu,
        }}
        item
        alignItems="center"
      >
        <Search />
        <Minicart />
      </Grid>
    </Grid>
  )
}

export default Header
