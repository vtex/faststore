import { createContext, useContext } from 'react'

export interface RadioGroupContext {
  /**
   * Name to link children by context.
   */
  name: string
  /**
   * Value of checked child.
   */
  value: string | number
  /**
   * Function that is triggered when any children is checked.
   */
  onChange?: (value: string | number) => void
}

export const RadioGroupContext = createContext<RadioGroupContext | undefined>(
  undefined
)

export function useRadioOption() {
  const context = useContext(RadioGroupContext)

  if (!context) {
    throw new Error(
      `useRadioOption hook cannot be used outside the RadioGroup context`
    )
  }

  return context
}
