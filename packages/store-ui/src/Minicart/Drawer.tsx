import Drawer, { DrawerProps } from '@vtex-components/drawer'
import React, { FC } from 'react'
import { Flex, Text } from 'theme-ui'

import { Variant } from '../utils/types'

export type MinicartDrawerProps = DrawerProps
export const MinicartDrawer = Drawer

export interface MinicartDrawerPrice extends Variant {
  currency: string
  text: string
  value?: number
}

export const MinicartDrawerPrice: FC<MinicartDrawerPrice> = ({
  currency,
  text,
  value = 0,
  variant,
}) => (
  <Flex variant={variant}>
    <Text variant={`${variant}.text`}>{text}</Text>
    <Text variant={`${variant}.value`}>{`${currency} ${value}`}</Text>
  </Flex>
)
