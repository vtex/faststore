import React, { FC } from 'react'
import { Flex, MinicartDrawerPrice, Text, Button } from '@vtex/store-ui'

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
        Shipping and taxes calculated at checkout.
      </Text>
      <Button>GO TO CHECKOUT</Button>
    </Flex>
  )
}
