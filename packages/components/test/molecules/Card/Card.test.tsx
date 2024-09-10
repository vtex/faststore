import { describe, expect, it } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

import React from 'react'

import { Card } from '../../../src/index'

expect.extend(toHaveNoViolations)

describe('Card', () => {
  const mockIconAction = jest.fn()
  it('renders with title', () => {
    render(<Card title="Test Card" />)

    const cardTitle = screen.getByText('Test Card')
    expect(cardTitle).toBeInTheDocument()
  })

  it('renders with custom max width', () => {
    render(<Card title="Test Card" maxWidth="500px" />)

    const card = screen.getByTestId('fs-card')
    expect(card).toHaveStyle('max-width: 500px')
  })

  it('renders with icon', () => {
    render(<Card title="Test Card" iconName="star" />)

    const iconButton = screen.getByLabelText(
      'Test Card action'
    ) as HTMLButtonElement
    expect(iconButton).toBeInTheDocument()
  })

  it('executes the icon action when clicked', () => {
    render(
      <Card title="Test Card" iconName="star" iconAction={mockIconAction} />
    )

    const iconButton = screen.getByLabelText(
      'Test Card action'
    ) as HTMLButtonElement
    iconButton.click()
    expect(mockIconAction).toHaveBeenCalled()
  })

  it('should not fail any accessibility tests', async () => {
    const { container } = render(
      <Card title="Test Card" iconName="star" iconAction={mockIconAction} />
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
