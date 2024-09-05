import { describe, expect, it } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'

import { Card } from '../../../src/index'

describe('Card', () => {
  const mockIconAction = jest.fn()
  it('renders the card component with title', () => {
    render(<Card title="Test Card" />)
    const cardTitle = screen.getByText('Test Card')

    expect(cardTitle).toBeInTheDocument()
  })

  it('renders the card component with custom max width', () => {
    render(<Card title="Test Card" maxWidth="500px" />)
    const card = screen.getByTestId('fs-card')

    expect(card).toHaveStyle('max-width: 500px')
  })

  it('renders the card component with icon', () => {
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
})
