import type { PropsWithChildren } from 'react'
import React from 'react'

import { RadioGroupContext } from './useRadioGroup'

export type RadioGroupProps = PropsWithChildren<RadioGroupContext>

export default function RadioGroup({
  name,
  onChange,
  children,
  selectedValue,
}: RadioGroupProps) {
  const contextValues = React.useMemo(() => {
    return { name, selectedValue, onChange }
  }, [name, selectedValue, onChange])

  return (
    <RadioGroupContext.Provider value={contextValues}>
      {children}
    </RadioGroupContext.Provider>
  )
}
