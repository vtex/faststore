import type { ChangeEventHandler } from 'react'
import { createContext, useContext } from 'react'

export interface RadioGroupContext {
  /**
   * Name to link children by context.
   */
  name: string
  /**
   * Value of checked child.
   */
  selectedValue?: string | number
  /**
   * Function that is triggered when any children is checked.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export const RadioGroupContext = createContext<RadioGroupContext | undefined>(
  undefined
)

export function useRadioGroup() {
  const context = useContext(RadioGroupContext)

  if (!context) {
    throw new Error(
      `useRadioOption hook cannot be used outside the RadioGroup context`
    )
  }

  return context
}
