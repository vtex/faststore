import React, { createContext, useContext as reactUseContext } from 'react'
import type { FC } from 'react'

interface PluginOptions {
  server: string
  sizes: string[]
  redirectBasePath?: string
}

const Context = createContext<PluginOptions | undefined>(undefined)

export const useContext = () => {
  const value = reactUseContext(Context)

  if (value === undefined) {
    throw new Error('[gatsby-plugin-thumbor]: Missing context in React tree')
  }

  return value
}

export const Provider: FC<{ options: PluginOptions }> = ({
  children,
  options,
}) => <Context.Provider value={options}>{children}</Context.Provider>
