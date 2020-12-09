import React, { createContext, useCallback, useState } from 'react'
import type { FC } from 'react'

export type MinicartStateContext = {
  isOpen: boolean
  toggle: () => void
}

export const MinicartState = createContext<MinicartStateContext>({
  isOpen: false,
  toggle: () => null,
})

export const MinicartProvider: FC = ({ children }) => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const toggle = useCallback(() => setOpen(!isOpen), [isOpen])

  return (
    <MinicartState.Provider value={{ isOpen, toggle }}>
      {children}
    </MinicartState.Provider>
  )
}
