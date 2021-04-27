import React, { createContext, useCallback, useState } from 'react'
import type { FC } from 'react'

export interface IContext {
  isOpen: boolean
  toggle: () => void
}

export const Context = createContext<IContext | undefined>(undefined)

export const Provider: FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen])

  return (
    <Context.Provider value={{ isOpen, toggle }}>{children}</Context.Provider>
  )
}
