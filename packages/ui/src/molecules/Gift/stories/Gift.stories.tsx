import type { Story, Meta } from '@storybook/react'
import React, { useMemo } from 'react'

import Badge from '../../../atoms/Badge/Badge'
import Price from '../../../atoms/Price/Price'
// Gift components
import GiftComponent from '../Gift'
import GiftContent from '../GiftContent'
import GiftImage from '../GiftImage'
import type { GiftProps } from '../Gift'
import mdx from './Gift.mdx'

function useIntlFormatter(price: number) {
  return useMemo(() => {
    const formattedPrice = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'USD',
    }).format(price)

    return formattedPrice
  }, [price])
}

const GiftTemplate: Story<GiftProps> = ({ testId }) => (
  <GiftComponent testId={testId}>
    <GiftImage>
      <img
        alt="Aedle VK-1 L Headphone"
        src="https://assets.vtex.app/unsafe/1608x1206/center/middle/https%3A%2F%2Fstoreframework.vtexassets.com%2Farquivos%2Fids%2F190901%2Funsplash-headphone.jpg%3Fv%3D637800115948430000"
      />
    </GiftImage>
    <GiftContent>
      <h3>Get a pair of Aedle VK-1 L Headphone</h3>
      <div>
        <Price value={145} formatter={useIntlFormatter} />
        <Badge>Free</Badge>
      </div>
    </GiftContent>
  </GiftComponent>
)

export const Gift = GiftTemplate.bind({})
Gift.storyName = 'Gift'

export default {
  title: 'Molecules/Gift',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
