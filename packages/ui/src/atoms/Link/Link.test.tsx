// Just to test with elements without 'href' attribute
/* eslint-disable jsx-a11y/anchor-is-valid */
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Link from '.'

const TestLink = () => {
  return <Link href="/">Link</Link>
}

describe('Link', () => {
  let link: HTMLElement
  let linkContainer: HTMLElement

  beforeEach(() => {
    const { getByTestId, container } = render(<TestLink />)

    link = getByTestId('store-link')
    linkContainer = container
  })

  describe('Data Attributes', () => {
    it('`Link` should have `data-store-link` attribute', () => {
      expect(link).toHaveAttribute('data-store-link')
    })
  })

  describe('Accessibility', () => {
    it('`Link` should have no violations', async () => {
      expect(await axe(linkContainer)).toHaveNoViolations()
    })
  })
})
