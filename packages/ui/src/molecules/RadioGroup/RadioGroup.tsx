import React from 'react'

import { RadioGroupContext } from './useRadioOption'

export interface RadioGroupProps {
  children: React.ReactNode
  name: string
  value: string | number
  onChange?: (value: string | number) => void
}

const RadioGroup = ({
  name,
  onChange,
  children,
  value: option,
}: RadioGroupProps) => {
  const value = React.useMemo(() => {
    return { name, option, onChange }
  }, [name, option, onChange])

  return (
    <RadioGroupContext.Provider value={value}>
      {children}
    </RadioGroupContext.Provider>
  )
}

export default RadioGroup
