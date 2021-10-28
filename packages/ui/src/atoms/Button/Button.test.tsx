import { render } from '@testing-library/react'
import React from 'react'

import Button from './Button'

describe('Button', () => {
  it('`data-store-button` is present', () => {
    const { getByText } = render(<Button>Hello World!</Button>)

    expect(getByText('Hello World!')).toHaveAttribute('data-store-button')
  })
})
