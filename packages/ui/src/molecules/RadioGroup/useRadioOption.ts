import { createContext, useContext } from 'react'

interface RadioGroupContext {
  name: string
  option: string | number
  onChange?: (option: string | number) => void
}

export const RadioGroupContext = createContext<RadioGroupContext | undefined>(
  undefined
)

export function useRadioOption() {
  const context = useContext(RadioGroupContext)

  if (!context) {
    throw new Error(
      `RadioOption component cannot be rendered outside the RadioGroup component`
    )
  }

  return context
}
