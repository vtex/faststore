import type { Story, Meta } from '@storybook/react'
import React, { useMemo } from 'react'

import { Badge, Price } from '@faststore/components'
// Gift components
import GiftComponent from '../Gift'
import GiftContent from '../GiftContent'
import GiftImage from '../GiftImage'
import type { GiftProps } from '../Gift'
import mdx from './Gift.mdx'

const Tag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
    <path fill="none" d="M0 0h256v256H0z" />
    <path
      d="M122.7 25.9 42 42l-16.1 80.7a8 8 0 0 0 2.2 7.2l104.4 104.4a7.9 7.9 0 0 0 11.3 0l90.5-90.5a7.9 7.9 0 0 0 0-11.3L129.9 28.1a8 8 0 0 0-7.2-2.2Z"
      fill="none"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
    <circle cx="84" cy="84" r="12" />
  </svg>
)

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
  <GiftComponent testId={testId} icon={<Tag />}>
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
