import React, { FC } from 'react'
import {
  Flex,
  MinicartDrawerPrice,
  Text,
  Button,
  LocalizedLink,
} from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

export interface HeaderMinicartDrawerFooterProps {
  variant?: string
  currency: string
  subtotal?: number
  total?: number
}

export const HeaderMinicartDrawerFooter: FC<HeaderMinicartDrawerFooterProps> = ({
  currency,
  total = 0,
  subtotal = 0,
  variant,
}) => {
  const customVariant = `${variant}.footer`
  const { formatMessage } = useIntl()

  return (
    <Flex variant={customVariant}>
      <MinicartDrawerPrice
        variant={`${customVariant}.total`}
        currency={currency}
        text="Total"
        value={total}
      />
      <MinicartDrawerPrice
        variant={`${customVariant}.subtotal`}
        currency={currency}
        text="Subtotal"
        value={subtotal}
      />
      <Text variant={`${customVariant}.message`}>
        {formatMessage({ id: 'minicart.drawer.shipping-disclaimer' })}
      </Text>
      <LocalizedLink to="/checkout#/cart">
        <Button sx={{ width: '100%' }}>
          {formatMessage({ id: 'minicart.drawer.go-checkout' })}
        </Button>
      </LocalizedLink>
    </Flex>
  )
}
