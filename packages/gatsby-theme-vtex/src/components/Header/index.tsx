import { Flex, Header } from '@vtex/store-ui'
import React, { Fragment } from 'react'

import StoreHeaderLogo from './Logo'
import StoreHeaderMenu from './Menu'
import NotificationBar from './NotificationBar'
import OverMenu from './OverMenu'
import StoreHeaderSearch from './Search'
import Minicart from './Minicart'

const StoreHeader = () => {
  const variant = 'header'

  return (
    <Fragment>
      <NotificationBar
        text="SELECTED ITEMS ON SALE! CHECK IT OUT!"
        variant={`${variant}.notificationbar`}
      />
      <OverMenu variant={`${variant}.overmenu`} />
      <Header variant={variant}>
        <Flex variant={`${variant}.left`}>
          <StoreHeaderLogo variant={`${variant}.logo`} />
          <StoreHeaderMenu variant={`${variant}.menu`} />
        </Flex>
        <Flex variant={`${variant}.right`}>
          <StoreHeaderSearch variant={`${variant}.search`} />
          <Minicart variant={variant} />
        </Flex>
      </Header>
    </Fragment>
  )
}

export default StoreHeader
