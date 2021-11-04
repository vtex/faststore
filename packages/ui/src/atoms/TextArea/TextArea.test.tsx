import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import TextArea from './TextArea'

const testId = 'store-textarea'

describe('TextArea', () => {
  it('data-store-textarea is present', () => {
    const { getByTestId } = render(<TextArea testId={testId} />)

    expect(getByTestId(testId)).toHaveAttribute('data-store-textarea')
  })

  it('state is error', () => {
    const { getByTestId } = render(<TextArea testId={testId} variant="error" />)

    expect(getByTestId(testId)).toHaveAttribute('data-error', 'true')
    expect(getByTestId(testId)).not.toHaveAttribute('data-success')
  })

  it('state is success', () => {
    const { getByTestId } = render(
      <TextArea testId={testId} variant="success" />
    )

    expect(getByTestId(testId)).toHaveAttribute('data-success', 'true')
    expect(getByTestId(testId)).not.toHaveAttribute('data-error')
  })

  describe('Accessibility', () => {
    it('should have no violations using aria-label', async () => {
      const { container } = render(
        <TextArea
          aria-label="label textarea for test"
          testId="store-textarea"
        />
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations using aria-labelledby', async () => {
      const { container } = render(
        <>
          <span id="label">My test label</span>
          <TextArea aria-labelledby="label" testId="store-textarea" />
        </>
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations using placeholder', async () => {
      const { container } = render(
        <TextArea
          placeholder="Accessibility placeholder"
          testId="store-textarea"
        />
      )

      expect(await axe(container)).toHaveNoViolations()
    })

    it('should have no violations using id with explicit label', async () => {
      const { container } = render(
        <>
          <label htmlFor="textarea">My test label</label>
          <TextArea id="textarea" testId="store-textarea" />
        </>
      )

      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
