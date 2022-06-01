import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Hero from './Hero'
import HeroImage from './HeroImage'
import HeroHeading from './HeroHeading'

const HeroTest = () => {
  return (
    <Hero data-custom-attribute>
      <HeroImage>
        <img
          alt="Quest 2 Controller on a table"
          src="https://storeframework.vtexassets.com/arquivos/ids/190897/Photo.jpg"
        />
      </HeroImage>
      <HeroHeading>
        <h3>Get yo know our next release</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <a href="/">Shop Now</a>
      </HeroHeading>
    </Hero>
  )
}

describe('Hero', () => {
  describe('Data attributes', () => {
    const { getByTestId } = render(<HeroTest />)

    const hero = getByTestId('store-hero')
    const heroImage = getByTestId('store-hero-image')
    const heroHeading = getByTestId('store-hero-heading')

    it('`Hero` component should have `data-store-hero` attribute', () => {
      expect(hero).toHaveAttribute('data-store-hero')
    })

    it('`Hero` component should have custom data attribute `data-custom-attribute`', () => {
      expect(hero).toHaveAttribute('data-custom-attribute')
    })

    it('`HeroImage` component should have `data-hero-image` attribute', () => {
      expect(heroImage).toHaveAttribute('data-hero-image')
    })

    it('`HeroHeading` component should have `data-hero-heading` attribute', () => {
      expect(heroHeading).toHaveAttribute('data-hero-heading')
    })
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<HeroTest />)

      expect(await axe(getByTestId('store-hero'))).toHaveNoViolations()
    })
  })
})
