import { render } from '@testing-library/react'
import React, { useState } from 'react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

import QuantitySelector from '.'

describe('QuantitySelector', () => {
  it('should render', () => {
    const { getByTestId } = render(
      <QuantitySelector
        name="quantity-selector"
        quantity={1}
        leftButtonProps={{ icon: <span>-</span> }}
        rightButtonProps={{ icon: <span>+</span> }}
        inputProps={{ readOnly: true }}
      />
    )

    expect(getByTestId('store-quantity-selector')).toBeInTheDocument()
  })

  it('should render with the correct quantity', () => {
    const { getByLabelText } = render(
      <QuantitySelector
        name="quantity-selector"
        quantity={123}
        leftButtonProps={{ icon: <span>-</span> }}
        rightButtonProps={{ icon: <span>+</span> }}
        inputProps={{ readOnly: true }}
      />
    )

    expect(getByLabelText('Quantity')).toHaveValue('123')
  })

  it('should update correctly according to event changes', () => {
    const QuantitySelectorTest = () => {
      const [quantity, setQuantity] = useState(1)

      return (
        <QuantitySelector
          name="quantity-selector"
          quantity={quantity}
          leftButtonProps={{
            icon: <span>-</span>,
            onClick: () => {
              setQuantity((curr) => curr - 1)
            },
          }}
          rightButtonProps={{
            icon: <span>+</span>,
            onClick: () => {
              setQuantity((curr) => curr + 1)
            },
          }}
          inputProps={{ readOnly: true }}
        />
      )
    }

    const { getByLabelText } = render(<QuantitySelectorTest />)

    expect(getByLabelText('Quantity')).toHaveValue('1')

    const rightButton = getByLabelText('Increment Quantity')
    const leftButton = getByLabelText('Decrement Quantity')

    userEvent.click(rightButton)
    expect(getByLabelText('Quantity')).toHaveValue('2')
    userEvent.click(leftButton)
    expect(getByLabelText('Quantity')).toHaveValue('1')
  })

  describe('QuantitySelector Accessibility', () => {
    it('should pass the AXE tests', async () => {
      render(
        <main>
          <QuantitySelector
            name="quantity-selector"
            quantity={1}
            leftButtonProps={{ icon: <span>-</span> }}
            rightButtonProps={{ icon: <span>+</span> }}
            inputProps={{ readOnly: true }}
          />
        </main>
      )

      expect(await axe(document.body)).toHaveNoViolations()
      expect(await axe(document.body)).toHaveNoIncompletes()
    })
  })
})
