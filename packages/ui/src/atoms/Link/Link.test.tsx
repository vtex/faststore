// Just to test with elements without 'href' attribute
/* eslint-disable jsx-a11y/anchor-is-valid */
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'
import type { ElementType } from 'react'

import type { LinkProps } from '.'
import LinkComponent from '.'

const TestLink = ({ href = '/', testId }: LinkProps<'a'>) => {
  return (
    <LinkComponent testId={testId} href={href}>
      Link
    </LinkComponent>
  )
}

describe('Link', () => {
  describe('Data Attributes', () => {
    it('`Link` should have `data-store-link` attribute', () => {
      const { getByTestId } = render(<TestLink />)

      expect(getByTestId('store-link')).toHaveAttribute('data-store-link')
    })

    it('`Link` should receive a custom component', () => {
      const { getByTestId } = render(
        <LinkComponent
          as={(props: ElementType) => (
            <div {...props} data-testid="container">
              <a href="/">Link</a>
            </div>
          )}
        />
      )

      expect(getByTestId('container')).toHaveAttribute('data-store-link')
    })
  })

  describe('Accessibility', () => {
    it('`Link` should have no violations', async () => {
      expect(await axe(document.body)).toHaveNoViolations()
      expect(await axe(document.body)).toHaveNoIncompletes()
    })
  })
})
