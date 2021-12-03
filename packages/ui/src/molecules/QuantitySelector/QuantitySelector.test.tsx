import { render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import React, { useState } from 'react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'

import {
  QuantitySelector,
  QuantitySelectorButton,
  QuantitySelectorInput,
  useQuantitySelector,
} from '.'

const QuantitySelectorTest = () => {
  const [value, setValue] = useState(1)

  return (
    <QuantitySelector
      name="quantity-selector"
      currentValue={value}
      onClick={() => setValue((curr) => curr + 1)}
    >
      <QuantitySelectorButton icon={<span>+</span>} />
      <QuantitySelectorInput aria-label="quantity-input" onChange={() => {}} />
    </QuantitySelector>
  )
}

describe('QuantitySelector', () => {
  it('should render QuantitySelector with its children', () => {
    const { getByTestId, getAllByTestId } = render(
      <QuantitySelector name="quantity-selector" currentValue={1}>
        <QuantitySelectorButton icon={<span>+</span>} />
        <QuantitySelectorInput onChange={() => {}} />
        <QuantitySelectorButton icon={<span>-</span>} />
      </QuantitySelector>
    )

    expect(getByTestId('store-quantity-selector-input')).toBeInTheDocument()
    expect(getAllByTestId('store-quantity-selector-button')).toHaveLength(2)
  })

  it('should render QuantitySelector with the correct values', () => {
    const { getByRole } = render(
      <QuantitySelector name="quantity-selector" currentValue={1}>
        <QuantitySelectorInput onChange={() => {}} />
      </QuantitySelector>
    )

    expect(getByRole('spinbutton')).toHaveValue('1')
  })

  it('should emit events with the correct values', () => {
    const onClick = jest.fn()
    const { getAllByTestId } = render(
      <QuantitySelector
        name="quantity-selector"
        currentValue={1}
        onClick={onClick}
      >
        <QuantitySelectorButton name="button-1" icon={<span>+</span>} />
        <QuantitySelectorInput onChange={() => {}} />
        <QuantitySelectorButton name="button-2" icon={<span>-</span>} />
      </QuantitySelector>
    )

    const [button1, button2] = getAllByTestId('store-quantity-selector-button')

    userEvent.click(button1)
    const [[eventBtn1]] = onClick.mock.calls

    expect(eventBtn1.target.name).toEqual('button-1')

    userEvent.click(button2)
    const [, [eventBtn2]] = onClick.mock.calls

    expect(eventBtn2.target.name).toEqual('button-2')

    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('Should update correctly according to event changes', () => {
    const { getByRole, getByTestId } = render(<QuantitySelectorTest />)

    expect(getByRole('spinbutton')).toHaveValue('1')
    const button1 = getByTestId('store-quantity-selector-button')

    userEvent.click(button1)
    expect(getByRole('spinbutton')).toHaveValue('2')
  })

  it('Should render useQuantitySelector hook', () => {
    const WrapperQuantitySelector = ({ children }: { children: ReactNode }) => (
      <QuantitySelector name="quantity-selector" currentValue={5}>
        {children}
      </QuantitySelector>
    )

    const { result } = renderHook(() => useQuantitySelector(), {
      wrapper: WrapperQuantitySelector,
    })

    expect(result.current.name).toEqual('quantity-selector')
    expect(result.current.currentValue).toEqual(5)
  })
})
