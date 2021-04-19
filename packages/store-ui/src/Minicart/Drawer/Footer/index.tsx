import { FormattedMessage } from '@vtex/gatsby-plugin-i18n'
import React from 'react'
import { Button, Flex, Text } from 'theme-ui'
import type { FC, MouseEventHandler } from 'react'

interface Props {
  variant: string
  total: number
  subTotal: number
  onCheckout: MouseEventHandler<HTMLButtonElement>
  numberFormat: (num: number) => string
}

// const checkout: MouseEventHandler<HTMLButtonElement> = (e) => {
//   e.preventDefault()
//   window.location.href = '/checkout/'
// }

const MinicartDrawerFooter: FC<Props> = ({
  variant: v,
  total,
  subTotal,
  onCheckout,
  numberFormat,
}) => {
  const variant = `${v}.footer`
  // const { orderForm } = useOrderForm()
  // const { formatMessage } = useIntl()
  // const { format } = useNumberFormat()
  // const total = format(Number(orderForm.value) / 100)
  // const subTotal = total

  return (
    <Flex variant={variant}>
      <Flex variant={`${variant}.total`}>
        <Text variant={`${variant}.total.text`}>
          <FormattedMessage id="minicart.drawer.total" />
        </Text>
        <Text variant={`${variant}.total.value`}>{numberFormat(total)}</Text>
      </Flex>
      <Flex variant={`${variant}.subtotal`}>
        <Text variant={`${variant}.subtotal.text`}>
          <FormattedMessage id="minicart.drawer.subtotal" />
        </Text>
        <Text variant={`${variant}.subtotal.value`}>
          {numberFormat(subTotal)}
        </Text>
      </Flex>
      <Text variant={`${variant}.shipping-disclaimer`}>
        <FormattedMessage id="minicart.drawer.shipping-disclaimer" />
      </Text>
      <Button variant={`${variant}.go-checkout`} onClick={onCheckout}>
        <FormattedMessage id="minicart.drawer.go-checkout" />
      </Button>
    </Flex>
  )
}

export default MinicartDrawerFooter
