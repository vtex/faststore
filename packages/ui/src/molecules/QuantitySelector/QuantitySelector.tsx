import type { HTMLAttributes } from 'react'
import React from 'react'

import { QuantitySelectorContext } from './useQuantitySelector'

export type QuantitySelectorProps = QuantitySelectorContext &
  Omit<HTMLAttributes<HTMLDivElement>, 'onClick'>

const QuantitySelector = ({
  name,
  onClick,
  children,
  currentValue,
  ...otherProps
}: QuantitySelectorProps) => {
  const contextValues = React.useMemo(() => {
    return { name, currentValue, onClick }
  }, [name, currentValue, onClick])

  return (
    <QuantitySelectorContext.Provider value={contextValues}>
      <div {...otherProps}>{children}</div>
    </QuantitySelectorContext.Provider>
  )
}

export default QuantitySelector
