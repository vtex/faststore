import { render } from '@testing-library/react'
import React from 'react'

import Button from './Button'

describe('Button', () => {
  it('renders children prop when passed', () => {
    const { getByText } = render(<Button>Hello World!</Button>)

    expect(getByText('Hello World!')).toBeInTheDocument()
  })
})
