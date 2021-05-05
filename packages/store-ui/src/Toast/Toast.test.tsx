import { render } from '@testing-library/react'
import React from 'react'

import Toast from './index'

describe('Toast Component', () => {
  const defaultContent = 'Component With Default Properties'
  const noopHideToast = jest.fn(() => {})

  it('Default Properties', () => {
    const { queryByText, queryByRole, queryByTestId } = render(
      <Toast content={defaultContent} hideToast={noopHideToast} />
    )

    expect(queryByText(defaultContent)).toBeInTheDocument()

    // Test SVG Icon
    expect(queryByTestId('check-icon')).toBeInTheDocument()

    // Test button
    expect(queryByRole('button')).toBeInTheDocument()
    queryByRole('button')?.click()
    expect(noopHideToast).toHaveBeenCalled()
  })

  it('Type: Error', () => {
    const { queryByTestId, queryByText } = render(
      <Toast content={defaultContent} hideToast={noopHideToast} type="error" />
    )

    expect(queryByText(defaultContent)).toBeInTheDocument()
    expect(queryByTestId('cross-icon')).toBeInTheDocument()
  })

  it('Type: Warning', () => {
    const { queryByTestId, queryByText } = render(
      <Toast
        content={defaultContent}
        hideToast={noopHideToast}
        type="warning"
      />
    )

    expect(queryByText(defaultContent)).toBeInTheDocument()
    expect(queryByTestId('warning-icon')).toBeInTheDocument()
  })
})
