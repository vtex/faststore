import { render, cleanup } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Component from '.'
import type { LinkProps } from '.'

const TestLinkAsAnchor = ({ href }: Pick<LinkProps, 'href'>) => {
  return <Component href={href}>Click here</Component>
}

const TestLinkAsDiv = ({ as }: Pick<LinkProps, 'as'>) => {
  return (
    <Component as={as}>
      <p>Some Link component</p>
      <a href="/">Click here</a>
    </Component>
  )
}

describe('Link', () => {
  let linkAsDiv: HTMLElement
  let linkAsAnchor: HTMLElement

  describe('Link as Div', () => {
    beforeEach(() => {
      const { getByTestId } = render(<TestLinkAsDiv as="div" />)

      linkAsDiv = getByTestId('store-link')
    })

    afterEach(cleanup)

    describe('Data Attributes', () => {
      it('`Link` should have `data-store-link` attribute', () => {
        expect(linkAsDiv).toHaveAttribute('data-store-link')
      })
    })

    describe('Accessibility', () => {
      it('`Link` should have no violations', async () => {
        expect(await axe(linkAsDiv)).toHaveNoViolations()
      })
    })
  })

  describe('Link as Anchor', () => {
    beforeEach(() => {
      const { getByTestId } = render(<TestLinkAsAnchor href="/" />)

      linkAsAnchor = getByTestId('store-link')
    })

    afterEach(cleanup)

    describe('Data Attributes', () => {
      it('`Link` should have `data-store-link` attribute', () => {
        expect(linkAsAnchor).toHaveAttribute('data-store-link')
      })
    })

    describe('Accessibility', () => {
      it('`Link` should have no violations', async () => {
        expect(await axe(linkAsAnchor)).toHaveNoViolations()
      })
    })
  })
})
