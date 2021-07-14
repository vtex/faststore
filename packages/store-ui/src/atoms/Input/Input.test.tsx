import { render } from '@testing-library/react'
import React from 'react'

import Input from '.'

describe('Input', () => {
  it('`data-store-input` is present', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Hello World!" />
    )

    expect(getByPlaceholderText('Hello World!')).toHaveAttribute(
      'data-store-input'
    )
  })
  it('`data-error` is present', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Hello World!" variant="error" />
    )

    expect(getByPlaceholderText('Hello World!')).toHaveAttribute('data-error')
  })
  it('`data-success` is present', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Hello World!" variant="success" />
    )

    expect(getByPlaceholderText('Hello World!')).toHaveAttribute('data-success')
  })
})
