import { Flex, Header, Input } from '@vtex/store-ui'
import React, { Fragment } from 'react'
import { useLocalizationIntl } from '@vtex/gatsby-vtex-localization'

import Logo from './Logo'
import Menu from './Menu'
import Minicart from './Minicart'
import NotificationBar from './NotificationBar'
import OverMenu from './OverMenu'

const StoreHeader = () => {
  const variant = 'header'
  const { formatMessage } = useLocalizationIntl()

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
          <Input
            variant={`${variant}.search`}
            placeholder="Search"
            aria-label="Search"
          />
          <Minicart />
        </Flex>
      </Header>
    </Fragment>
  )
}

export default StoreHeader
