import type { PropsWithChildren } from 'react'
import React from 'react'

import { QuantitySelectorContext } from './useQuantitySelector'

export type QuantitySelectorProps = PropsWithChildren<QuantitySelectorContext>

const QuantitySelector = ({
  name,
  onClick,
  children,
  currentValue,
}: QuantitySelectorProps) => {
  const contextValues = React.useMemo(() => {
    return { name, currentValue, onClick }
  }, [name, currentValue, onClick])

  return (
    <QuantitySelectorContext.Provider value={contextValues}>
      {children}
    </QuantitySelectorContext.Provider>
  )
}

export default QuantitySelector
