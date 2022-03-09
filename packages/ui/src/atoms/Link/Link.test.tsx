import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

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
  it('should receive a custom component', () => {
    const { getByTestId } = render(
      <LinkComponent
        href="/"
        as={(props: { href: string }) => {
          return (
            <div {...props}>
              <a data-testid="custom-anchor" href={props.href}>
                Link
              </a>
            </div>
          )
        }}
      />
    )

    expect(getByTestId('custom-anchor')).toHaveAttribute('href', '/')
    expect(getByTestId('store-link')).toHaveAttribute('data-store-link')
  })

  describe('Data Attributes', () => {
    it('should have `data-store-link` attribute', () => {
      const { getByTestId } = render(<TestLink />)

      expect(getByTestId('store-link')).toHaveAttribute('data-store-link')
    })
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<TestLink />)

      expect(await axe(getByTestId('store-link'))).toHaveNoViolations()
      expect(await axe(getByTestId('store-link'))).toHaveNoIncompletes()
    })
  })
})
