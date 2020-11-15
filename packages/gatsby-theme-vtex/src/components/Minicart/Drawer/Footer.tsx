import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Button, Flex, Text } from '@vtex/store-ui'
import React, { FC } from 'react'

import { useNumberFormat } from '../../../sdk/localization/useNumberFormat'
import { useOrderForm } from '../../../sdk/orderForm/useOrderForm'

export interface HeaderMinicartDrawerFooterProps {
  variant?: string
}

export const HeaderMinicartDrawerFooter: FC<HeaderMinicartDrawerFooterProps> = ({
  variant,
}) => {
  const customVariant = `${variant}.footer`
  const orderForm = useOrderForm()
  const { formatMessage } = useIntl()
  const { format } = useNumberFormat()
  const total = format(Number(orderForm.value?.value) / 100)
  const subTotal = total

  return (
    <Flex variant={customVariant}>
      <Flex variant={`${customVariant}.total`}>
        <Text variant={`${customVariant}.total.text`}>Total</Text>
        <Text variant={`${customVariant}.total.value`}>{total}</Text>
      </Flex>
      <Flex variant={`${customVariant}.subtotal`}>
        <Text variant={`${customVariant}.subtotal.text`}>Subtotal</Text>
        <Text variant={`${customVariant}.subtotal.value`}>{subTotal}</Text>
      </Flex>
      <Text variant={`${customVariant}.message`}>
        {formatMessage({ id: 'minicart.drawer.shipping-disclaimer' })}
      </Text>
      <Button
        variant={`${customVariant}.button`}
        onClick={(e: any) => {
          e.preventDefault()
          window.location.href = '/checkout/'
        }}
      >
        {formatMessage({ id: 'minicart.drawer.go-checkout' })}
      </Button>
    </Flex>
  )
}
