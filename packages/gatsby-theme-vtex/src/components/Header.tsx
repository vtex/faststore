import React, { FC } from 'react'
import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

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
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  logo: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
    },
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
      justifyContent: 'start',
    },
  },
  rootRightMenu: {
    display: 'flex',
    padding: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
}))

const Header: FC = () => {
  const classes = useStyles()

  return (
    <Grid
      classes={{
        root: classes.rootRightMenu,
      }}
      component="header"
      container
      alignItems="center"
      justify="space-between"
    >
      <Grid item container xs={12} sm>
        <div className={classes.logo}>
          <Logo />
        </div>
        <Menu />
      </Grid>
      <Grid
        classes={{
          root: classes.rootRightMenu,
        }}
        item
        justify="center"
      >
        <Search />
        <Minicart />
      </Grid>
    </Grid>
  )
}

export default Header
