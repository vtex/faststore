import { cleanup, render } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { Card } from '../../../src/index'

afterEach(() => {
  cleanup()
})

describe('Card', () => {
  const mockIconAction = vi.fn()
  it('renders with title', () => {
    const renderResult = render(<Card title="Test Card" />)

    const cardTitle = renderResult.getByText('Test Card')
    expect(cardTitle).toBeInTheDocument()
  })

  it('renders with custom max width', () => {
    const renderResult = render(<Card title="Test Card" maxWidth="500px" />)

    const card = renderResult.getByTestId('fs-card')
    expect(card).toHaveStyle('max-width: 500px')
  })

  it('renders with icon', () => {
    const renderResult = render(<Card title="Test Card" iconName="star" />)

    const iconButton = renderResult.getByLabelText('Test Card action', {
      selector: 'button',
    })
    expect(iconButton).toBeInTheDocument()
  })

  it('executes the icon action when clicked', () => {
    const renderResult = render(
      <Card title="Test Card" iconName="star" iconAction={mockIconAction} />
    )

    const iconButton = renderResult.getByLabelText('Test Card action', {
      selector: 'button',
    })
    iconButton.click()
    expect(mockIconAction).toHaveBeenCalled()
  })

  it('should not fail any accessibility tests', async () => {
    const { container } = render(
      <Card title="Test Card" iconName="star" iconAction={mockIconAction} />
    )
    // @ts-expect-error
    expect(await axe(container)).toHaveNoViolations()
  })
})
