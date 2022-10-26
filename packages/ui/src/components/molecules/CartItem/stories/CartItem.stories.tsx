import React from 'react'

import CartItem, {
  CartItemActions,
  CartItemContent,
  CartItemImage,
  CartItemPrices,
  CartItemSummary,
  CartItemTitle,
} from '../'
import { Button, Price, QuantitySelector } from '../../../'
import mdx from './CartItem.mdx'

import type { Meta, Story } from '@storybook/react'
import type { CartItemProps } from '../'

const product = {
  name: 'Apple Magic Mouse',
  imageUrl:
    'https://assets.vtex.app/unsafe/216x216/center/middle/https%3A%2F%2Fstoreframework.vtexassets.com%2Farquivos%2Fids%2F190902%2Funsplash-magic-mouse.jpg%3Fv%3D637800136963870000',
  price: {
    listing: 999,
    spot: 950,
  },
}

const CartItemTemplate: Story<CartItemProps> = ({ testId }) => {
  return (
    <CartItem testId={testId}>
      <CartItemContent>
        <CartItemImage>
          <img alt={product.name} src={product.imageUrl} />
        </CartItemImage>

        <CartItemSummary>
          <CartItemTitle>{product.name}</CartItemTitle>

          <CartItemPrices>
            <Price variant="listing" value={product.price.listing} />
            <Price variant="spot" value={product.price.spot} />
          </CartItemPrices>
        </CartItemSummary>
      </CartItemContent>

      <CartItemActions>
        <Button>Remove</Button>

        <QuantitySelector
          quantity={1}
          leftButtonProps={{ icon: <span>-</span> }}
          rightButtonProps={{ icon: <span>+</span> }}
          inputProps={{ readOnly: true }}
        />
      </CartItemActions>
    </CartItem>
  )
}

export const Default = CartItemTemplate.bind({})

Default.storyName = 'CartItem'

export default {
  title: 'Molecules/CartItem',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
