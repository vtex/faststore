import React from 'react'

import { RadioGroupContext } from './useRadioOption'

export interface RadioGroupProps extends RadioGroupContext {
  /**
   * Children to use RadioGroup provider.
   */
  children: React.ReactNode
}

const RadioGroup = ({ name, onChange, children, value }: RadioGroupProps) => {
  const contextValues = React.useMemo(() => {
    return { name, value, onChange }
  }, [name, value, onChange])

  return (
    <RadioGroupContext.Provider value={contextValues}>
      {children}
    </RadioGroupContext.Provider>
  )
}

export default RadioGroup
