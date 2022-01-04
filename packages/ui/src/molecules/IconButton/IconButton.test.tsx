import React from 'react'
import { render } from '@testing-library/react'

import IconButton from './IconButton'

describe('IconButton', () => {
  const testId = 'store-icon-button'

  it('data-store-icon-button is present', () => {
    const { getByTestId } = render(
      <IconButton testId={testId} label="foo" icon={<div>foo</div>} />
    )

    const iconButton = getByTestId(testId)

    expect(iconButton).toBeInTheDocument()
    expect(iconButton).toHaveAttribute('data-store-icon-button')
  })

  it('icon is present', () => {
    const { getByTestId } = render(
      <IconButton
        testId={testId}
        label="foo"
        icon={<div data-testid="icon">foo</div>}
      />
    )

    expect(getByTestId('icon')).toBeInTheDocument()
  })
})
