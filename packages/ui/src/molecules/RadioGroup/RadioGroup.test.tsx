import { render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import React from 'react'

import { RadioGroup, RadioOption, useRadioOption } from '.'

describe('RadioGroup', () => {
  it('Should render radio group with radio option', () => {
    const { getByTestId, getAllByLabelText } = render(
      <RadioGroup name="radio-group" value="radio">
        <RadioOption value="radio" label="Radio 1" />
      </RadioGroup>
    )

    const [radio] = getAllByLabelText(/Radio 1/i)

    expect(radio).toBeInTheDocument()
    expect(getByTestId('store-radio-option')).toBeInTheDocument()
  })
  it('Should render RadioOption Children', () => {
    const { getByRole } = render(
      <RadioGroup name="radio-group" value="radio-1">
        <RadioOption value="radio-1" label="Radio 1">
          <h1>Radio Group 1</h1>
        </RadioOption>
      </RadioGroup>
    )

    expect(getByRole('heading')).toHaveTextContent('Radio Group 1')
  })
  it('Should pass name from RadioGroup to RadioOptions', () => {
    const { container } = render(
      <RadioGroup name="radio-group" value="radio-1">
        <RadioOption value="radio-1" label="Radio 1" />
        <RadioOption value="radio-1" label="Radio 1" />
      </RadioGroup>
    )

    const options = container.querySelectorAll('[name="radio-group"]')

    expect(options).toHaveLength(2)
  })

  it('Should emit onChange with rigth value', () => {
    const onChange = jest.fn()

    const { getByTestId } = render(
      <RadioGroup name="radio-group" value="radio-1" onChange={onChange}>
        <RadioOption value="radio-1" label="Radio 1">
          Radio 1
        </RadioOption>
        <RadioOption
          value="radio-2"
          label="Radio 1"
          testId="store-radio2-option"
        >
          Radio 2
        </RadioOption>
      </RadioGroup>
    )

    const radio2 = getByTestId('store-radio2-option')

    userEvent.click(radio2)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('radio-2')
  })

  it('Should render useRadioGroup hook', async () => {
    const WrapperRadioGroup = ({ children }: { children: ReactNode }) => (
      <RadioGroup name="radio-group" value="radio-1">
        {children}
      </RadioGroup>
    )

    const { result } = renderHook(() => useRadioOption(), {
      wrapper: WrapperRadioGroup,
    })

    expect(result.current.name).toEqual('radio-group')
    expect(result.current.value).toEqual('radio-1')
  })
})
