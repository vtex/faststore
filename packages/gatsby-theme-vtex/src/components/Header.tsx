import React, { FC } from 'react'

import Logo from './Logo'
import Search from './Search'
import Minicart from './Minicart'
import Menu from './Menu'
import Grid from './material-ui-components/Grid'

// TODO: Style
const Header: FC = () => (
  <Grid component="header" container justify="space-between">
    <Grid item container sm>
      <Logo />
      <Menu />
    </Grid>
    <Grid item>
      <Search />
      <Minicart />
    </Grid>
  </Grid>
)

export default Header
