import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Card from './Card'
import CardImage from './CardImage'
import CardContent from './CardContent'
import CardActions from './CardActions'

const TestCard = () => {
  return (
    <Card>
      <CardImage>
        <div>An image</div>
      </CardImage>
      <CardContent>
        <h3>A title</h3>
        <p>89.90</p>
        <div>A tag</div>
      </CardContent>
      <CardActions>
        <button>A button</button>
      </CardActions>
    </Card>
  )
}

describe('Card', () => {
  let card: HTMLElement
  let cardImage: HTMLElement
  let cardContent: HTMLElement
  let cardActions: HTMLElement
  let cardContainer: HTMLElement

  beforeEach(() => {
    const { getByTestId, container } = render(<TestCard />)

    cardContainer = container
    card = getByTestId('store-card')
    cardImage = getByTestId('store-card-image')
    cardContent = getByTestId('store-card-content')
    cardActions = getByTestId('store-card-actions')
  })

  describe('Data attributes', () => {
    it('`Card` component should have `data-store-card` attribute', () => {
      expect(card).toHaveAttribute('data-store-card')
    })

    it('`CardContent` component should have `data-card-content` attribute', () => {
      expect(cardContent).toHaveAttribute('data-card-content')
    })

    it('`CardImage` component should have `data-card-image` attribute', () => {
      expect(cardImage).toHaveAttribute('data-card-image')
    })

    it('`CardActions` component should have `data-card-actions` attribute', () => {
      expect(cardActions).toHaveAttribute('data-card-actions')
    })
  })

  describe('Accessibility', () => {
    it('should not have violations', async () => {
      expect(await axe(cardContainer)).toHaveNoViolations()
    })
  })
})
