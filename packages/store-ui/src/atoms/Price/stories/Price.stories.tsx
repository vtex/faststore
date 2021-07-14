import React, { useMemo } from 'react'
import type { Story } from '@storybook/react'

import Component from '../Price'
import type { PriceProps } from '../Price'
import mdx from './Price.mdx'
import type { ComponentArgTypes } from '../../../typings/utils'

const priceValue = 62.5

const PriceTemplate: Story<PriceProps> = ({ value }) => (
  <Component value={value} />
)

export const Default = PriceTemplate.bind({})
Default.args = {
  value: priceValue,
}

const INTLFormattedTemplate: Story<PriceProps> = ({ value, variant }) => {
  function useIntlFormatter(price: number) {
    return useMemo(() => {
      const formattedPrice = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'EUR',
      }).format(price)

      return formattedPrice
    }, [price])
  }

  return (
    <Component formatter={useIntlFormatter} value={value} variant={variant} />
  )
}

export const INTLFormatted = INTLFormattedTemplate.bind({})
INTLFormatted.args = {
  value: priceValue,
}

const INTLFormattedToPartsTemplate: Story<PriceProps> = ({
  value,
  variant,
}) => {
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

  return (
    <Component
      formatter={useIntlPartsFormatter}
      value={value}
      variant={variant}
    />
  )
}

export const INTLFormattedToParts = INTLFormattedToPartsTemplate.bind({})
INTLFormattedToParts.args = {
  value: priceValue,
}

const VariantTemplate: Story<PriceProps> = ({ value, variant }) => (
  <Component value={value} variant={variant} />
)

export const Variant = VariantTemplate.bind({})
Variant.args = {
  value: priceValue,
  variant: 'listing',
}

export const Custom: Story<PriceProps> = ({ value, variant }) => {
  function customFormatter(price: number) {
    const unformattedPrice = `${price}`
    const formattedPrice = `${unformattedPrice.replace('.', ',')} reais`

    return formattedPrice
  }

  return (
    <Component formatter={customFormatter} value={value} variant={variant} />
  )
}

Custom.args = {
  value: priceValue,
}

const constrols: ComponentArgTypes<Omit<PriceProps, 'value'>> = {
  variant: {
    options: ['selling', 'listing', 'spot', 'savings', 'installment'],
    control: { type: 'select' },
  },
  formatter: {
    table: { disable: true },
  },
}

export default {
  title: 'Atoms/Price',
  argTypes: {
    ...constrols,
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
