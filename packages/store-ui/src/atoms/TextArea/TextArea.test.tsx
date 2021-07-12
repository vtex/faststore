import React from 'react'
import { render } from '@testing-library/react'

import TextArea from './TextArea'

const testId = 'store-textarea'

describe('TextArea', () => {
  it('data-store-textarea is present', () => {
    const { getByTestId } = render(<TextArea testId={testId} />)

    expect(getByTestId(testId)).toHaveAttribute('data-store-textarea')
  })

  it('state is error', () => {
    const { getByTestId } = render(<TextArea testId={testId} state="error" />)

    expect(getByTestId(testId)).toHaveAttribute('data-error', 'true')
    expect(getByTestId(testId)).not.toHaveAttribute('data-success')
  })

  it('state is success', () => {
    const { getByTestId } = render(<TextArea testId={testId} state="success" />)

    expect(getByTestId(testId)).toHaveAttribute('data-success', 'true')
    expect(getByTestId(testId)).not.toHaveAttribute('data-error')
  })
})
