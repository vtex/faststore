import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Hero from './Hero'

describe('Hero', () => {
  it('should have `data-store-hero` attribute', () => {
    const { getByTestId } = render(<Hero>Testing</Hero>)

    expect(getByTestId('store-hero')).toHaveAttribute('data-store-hero')
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<Hero>Testing</Hero>)

      expect(await axe(getByTestId('store-hero'))).toHaveNoViolations()
    })
  })
})
