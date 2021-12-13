import type { Story, Meta } from '@storybook/react'
import React from 'react'

// Atoms
import Price from '../../../atoms/Price'
import Badge from '../../../atoms/Badge'
import Button from '../../../atoms/Button'
// Card components
import CardComponent from '../Card'
import CardImage from '../CardImage'
import CardContent from '../CardContent'
import CardActions from '../CardActions'
import type { CardProps } from '../Card'
import mdx from './Card.mdx'

const CardTemplate: Story<CardProps> = ({ testId }) => {
  return (
    <CardComponent testId={testId}>
      <CardImage>
        <img
          alt="A vintage camera"
          src="https://storecomponents.vtex.app/assets/fit-in/480x480/center/middle/https%3A%2F%2Fstorecomponents.vtexassets.com%2Farquivos%2Fids%2F155481%2FFrame-3.jpg%3Fv%3D636793814536230000"
        />
      </CardImage>
      <CardContent>
        <h3>Vintage Top Camera</h3>
        <div>
          <Price
            value={89.9}
            variant="selling"
            formatter={formatter}
            style={{ textDecoration: 'line-through' }}
          />
          <Price value={68.9} variant="selling" formatter={formatter} />
        </div>
        <Badge>15% OFF</Badge>
      </CardContent>
      <CardActions>
        <Button onClick={() => null}>Add to Cart</Button>
      </CardActions>
    </CardComponent>
  )
}

function formatter(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export const Card = CardTemplate.bind({})
Card.storyName = 'Card'

export default {
  title: 'Organisms/Card',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
