import { FormattedMessage } from 'react-intl'
import React from 'react'
import { Button, Flex, Text } from 'theme-ui'
import type { FC, MouseEventHandler } from 'react'

import Center from '../../../Center'
import Spinner from '../../../Spinner'

interface Props {
  variant: string
  total: number
  subTotal: number
  onCheckout: MouseEventHandler<HTMLButtonElement>
  disableViewCart: boolean
  numberFormat: (num: number) => string
}

const MinicartDrawerFooter: FC<Props> = ({
  variant: v,
  total,
  subTotal,
  disableViewCart,
  onCheckout,
  numberFormat,
}) => {
  const variant = `${v}.footer`

  return (
    <Flex variant={variant}>
      <Flex variant={`${variant}.total`}>
        <Text variant={`${variant}.total.text`}>
          <FormattedMessage id="minicart.drawer.total" />
        </Text>
        <Text
          data-testid="minicartTotalValue"
          variant={`${variant}.total.value`}
        >
          {numberFormat(total)}
        </Text>
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
      <Button
        data-testid="goCheckout"
        variant={`${variant}.go-checkout`}
        disabled={disableViewCart}
        onClick={onCheckout}
      >
        {disableViewCart ? (
          <Center>
            <Spinner
              width="16px"
              height="16px"
              variant={`${variant}.checkout.spinner`}
            />
          </Center>
        ) : (
          <FormattedMessage id="minicart.drawer.go-checkout" />
        )}
      </Button>
    </Flex>
  )
}

export default MinicartDrawerFooter
