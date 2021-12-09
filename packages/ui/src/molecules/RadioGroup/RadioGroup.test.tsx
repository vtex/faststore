import { render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import React from 'react'

import RadioGroup from './RadioGroup'
import RadioOption from './RadioOption'
import { useRadioGroup } from './useRadioGroup'

describe('RadioGroup', () => {
  it('Should render radio group with radio option', () => {
    const onChange = jest.fn()

    const { getByTestId, getByRole } = render(
      <RadioGroup name="radio-group" selectedValue="radio" onChange={onChange}>
        <RadioOption value="radio" label="Radio 1" />
      </RadioGroup>
    )

    const radio = getByRole('radio', { name: 'Radio 1' })

    expect(radio).toBeInTheDocument()
    expect(getByTestId('store-radio-option')).toBeInTheDocument()
  })
  it('Should render RadioOption Children', () => {
    const onChange = jest.fn()
    const { getByRole } = render(
      <RadioGroup
        name="radio-group"
        selectedValue="radio-1"
        onChange={onChange}
      >
        <RadioOption value="radio-1" label="Radio 1">
          <h1>Radio Group 1</h1>
        </RadioOption>
      </RadioGroup>
    )

    expect(getByRole('heading')).toHaveTextContent('Radio Group 1')
  })
  it('Should pass name from RadioGroup to RadioOptions', () => {
    const onChange = jest.fn()

    const { container } = render(
      <RadioGroup
        name="radio-group"
        selectedValue="radio-1"
        onChange={onChange}
      >
        <RadioOption value="radio-1" label="Radio 1" />
        <RadioOption value="radio-2" label="Radio 2" />
      </RadioGroup>
    )

    const options = container.querySelectorAll('[name="radio-group"]')

    expect(options).toHaveLength(2)
  })

  it('Should emit onChange with right value', () => {
    const onChange = jest.fn()

    const { getByTestId } = render(
      <RadioGroup
        name="radio-group"
        selectedValue="radio-1"
        onChange={onChange}
      >
        <RadioOption value="radio-1" label="Radio 1">
          Radio 1
        </RadioOption>
        <RadioOption
          value="radio-2"
          label="Radio 2"
          testId="store-radio2-option"
        >
          Radio 2
        </RadioOption>
      </RadioGroup>
    )

    const radio2 = getByTestId('store-radio2-option')

    userEvent.click(radio2)

    const [[event]] = onChange.mock.calls

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(event.target.value).toEqual('radio-2')
  })

  it('Should render useRadioGroup hook', () => {
    const WrapperRadioGroup = ({ children }: { children: ReactNode }) => (
      <RadioGroup name="radio-group" selectedValue="radio-1">
        {children}
      </RadioGroup>
    )

    const { result } = renderHook(() => useRadioGroup(), {
      wrapper: WrapperRadioGroup,
    })

    expect(result.current.name).toEqual('radio-group')
    expect(result.current.selectedValue).toEqual('radio-1')
  })
})
