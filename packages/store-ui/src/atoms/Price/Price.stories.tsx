import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { PriceProps } from './Price'
import Root from './Price'

function intlFormatter(price: number) {
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)

  return formattedPrice
}

function intlPartsFormatter(price: number) {
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
  children: 'Price',
  value: 2.32,
}

export const IntlFormatted = PriceTemplate.bind({})

IntlFormatted.args = {
  children: 'Price',
  value: 62.5,
  formatter: intlFormatter,
}

export const IntlFormattedToParts = PriceTemplate.bind({})
IntlFormattedToParts.args = {
  children: 'Price',
  value: 32.5,
  formatter: intlPartsFormatter,
}

export const Listing = PriceTemplate.bind({})
Listing.args = {
  children: 'Price',
  value: 3.45,
  formatter: intlFormatter,
  listing: true,
}

export const Custom = PriceTemplate.bind({})
Custom.args = {
  children: 'Price',
  value: 3.75,
  formatter: customFormatter,
}
