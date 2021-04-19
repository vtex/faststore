import React, { createContext, useCallback, useState } from 'react'
import type { FC } from 'react'

export type MinicartContext = {
  isOpen: boolean
  toggle: () => void
}

export const Context = createContext<MinicartContext | undefined>(undefined)

export const MinicartProvider: FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen])

  return (
    <Context.Provider value={{ isOpen, toggle }}>{children}</Context.Provider>
  )
}
