import type { Meta, Story } from '@storybook/react'
import React, { useMemo } from 'react'

import type { PriceProps } from './Price'
import Root from './Price'

function useIntlFormatter(price: number) {
  return useMemo(() => {
    const formattedPrice = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)

    return formattedPrice
  }, [price])
}

function useIntlPartsFormatter(price: number) {
  return useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    })
      .formatToParts(price)
      .map((part) => {
        const props = {
          [`data-store-price-${part.type}`]: true,
        } as Record<string, unknown>

        if (part.type === 'integer') {
          props.style = { fontWeight: 700 }
        }

        return (
          <span key={part.type} {...props}>
            {part.value}
          </span>
        )
      })
  }, [price])
}

function customFormatter(price: number) {
  const unformattedPrice = `${price}`
  const formattedPrice = `${unformattedPrice.replace('.', ',')} reais`

  return formattedPrice
}

export default {
  title: 'Atoms/Price',
} as Meta

const PriceTemplate: Story<PriceProps> = (args) => <Root {...args} />

export const Default = PriceTemplate.bind({})

Default.args = {
  value: 2.32,
}

export const IntlFormatted = PriceTemplate.bind({})

IntlFormatted.args = {
  value: 62.5,
  formatter: useIntlFormatter,
}

export const IntlFormattedToParts = PriceTemplate.bind({})
IntlFormattedToParts.args = {
  value: 32.5,
  formatter: useIntlPartsFormatter,
}

export const Variant = PriceTemplate.bind({})
Variant.args = {
  value: 3.45,
  formatter: useIntlFormatter,
  variant: 'listing',
}

Variant.argTypes = {
  variant: {
    options: ['selling', 'listing', 'spot', 'savings', 'installment'],
    control: { type: 'select' },
  },
}

export const Custom = PriceTemplate.bind({})
Custom.args = {
  value: 3.75,
  formatter: customFormatter,
}
