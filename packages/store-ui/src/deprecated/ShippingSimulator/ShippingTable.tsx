import { useIntl } from 'react-intl'
import { Box } from 'theme-ui'
import React, { useMemo } from 'react'
import type { FC } from 'react'

import { TranslateEstimate } from './TranslateEstimate'

// Keeping this Maybe<T> so that this component can still be used in our
// Gatsby theme.
type Maybe<T> = T | null | undefined
type ShippingQueryQuery = {
  vtex: {
    shippingSLA: Maybe<{
      deliveryOptions: Array<{ id: string; estimate: string; price: number }>
    }>
  }
}

type ShippingOptionProps = {
  id: string
  estimate: string
  price?: number | null
  variant: string
  formattingFunction: Intl.NumberFormat['format']
}

const ShippingOption: FC<ShippingOptionProps> = ({
  id,
  price,
  estimate,
  variant,
  formattingFunction,
}) => {
  const intl = useIntl()

  const freightPrice = useMemo(() => {
    if (price === 0) {
      return intl.formatMessage({ id: 'shipping.free' })
    }

    if (!price) {
      return '-'
    }

    return formattingFunction(price / 100)
  }, [price, formattingFunction, intl])

  return (
    <Box as="tr" variant={`${variant}.optionRow`}>
      <Box as="td" variant={`${variant}.idCell`}>
        <Box as="label" variant={`${variant}.idLabel`}>
          <input type="radio" name="shipping-option" />
          {id}
        </Box>
      </Box>
      <Box as="td" variant={`${variant}.estimateCell`}>
        <TranslateEstimate shippingEstimate={estimate} />
      </Box>
      <Box as="td" variant={`${variant}.priceCell`}>
        {freightPrice}
      </Box>
    </Box>
  )
}

type ShippingTableProps = {
  shipping: ShippingQueryQuery | null
  numberFormattingFunction: Intl.NumberFormat['format']
  variant: string
}

const ShippingTable: FC<ShippingTableProps> = ({
  shipping,
  numberFormattingFunction,
  variant: tableVariant,
}) => {
  const intl = useIntl()

  if (!shipping?.vtex?.shippingSLA?.deliveryOptions?.length) {
    return null
  }

  return (
    <Box data-testid="shippingTable" as="table" variant={tableVariant}>
      <Box as="thead" variant={`${tableVariant}.thead`}>
        <Box as="tr" variant={`${tableVariant}.thead.row`}>
          <Box as="th" variant={`${tableVariant}.thead.id`}>
            {intl.formatMessage({ id: 'shipping.label.id' })}
          </Box>
          <Box as="th" variant={`${tableVariant}.thead.estimate`}>
            {intl.formatMessage({ id: 'shipping.label.estimate' })}
          </Box>
          <Box as="th" variant={`${tableVariant}.thead.price`}>
            {intl.formatMessage({ id: 'shipping.label.price' })}
          </Box>
        </Box>
      </Box>
      <Box as="tbody" variant={`${tableVariant}.tbody`}>
        {shipping?.vtex.shippingSLA?.deliveryOptions?.map((option) => {
          if (!option?.estimate || !option.id) return null

          const shippingOptionProps = {
            id: option.id,
            price: option.price,
            estimate: option.estimate,
          }

          return (
            <ShippingOption
              variant={tableVariant}
              key={shippingOptionProps.id}
              formattingFunction={numberFormattingFunction}
              {...shippingOptionProps}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default ShippingTable
