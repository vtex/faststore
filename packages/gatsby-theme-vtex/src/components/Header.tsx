import React, { FC } from 'react'
import makeStyles from '@material-ui/styles/makeStyles'
import type { Theme } from '@material-ui/core'
import Box from '@material-ui/core/Box'

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
}))

const useRightMenuStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
}))

const Header: FC = () => {
  const containerClasses = useStyles()
  const rightMenuStyles = useRightMenuStyles()

  return (
    <Grid
      classes={containerClasses}
      component="header"
      container
      alignItems="center"
      justify="space-between"
    >
      <Grid item container xs={12} sm>
        <Box
          display="flex"
          width={{ xs: '100%', sm: 'auto' }}
          justifyContent={{ xs: 'center', sm: 'start' }}
        >
          <Logo />
        </Box>
        <Menu />
      </Grid>
      <Grid classes={rightMenuStyles} item justify="center">
        <Search />
        <Minicart />
      </Grid>
    </Grid>
  )
}

export default Header
