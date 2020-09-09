import { Flex, Header } from '@vtex/store-ui'
import React, { Fragment } from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import Logo from './Logo'
import Menu from './Menu'
import Minicart from './Minicart'
import NotificationBar from './NotificationBar'
import OverMenu from './OverMenu'
import SearchBar from './SearchBar'

const StoreHeader = () => {
  const variant = 'header'
  const { formatMessage } = useIntl()

  return (
    <Fragment>
      <NotificationBar
        text={formatMessage({ id: 'notification-bar.sale' })}
        variant={`${variant}.notificationbar`}
      />
      <OverMenu variant={`${variant}.overmenu`} />
      <Header variant={variant}>
        <Flex variant={`${variant}.left`}>
          <Logo variant={`${variant}.logo`} />
          <Menu variant={`${variant}.menu`} />
        </Flex>
        <Flex variant={`${variant}.right`}>
          <SearchBar
            variant={variant}
            placeholder="Search"
            aria-label="Search Placeholder"
          />
          <Minicart />
        </Flex>
      </Header>
    </Fragment>
  )
}

export default StoreHeader
