import React, { FC } from 'react'
import { Input, InputProps } from 'theme-ui'

import { useSearchBarContext } from './hooks'

interface Props extends Omit<InputProps, 'ref'> {
  onSearch: (term: string) => unknown
}

export const SearchBarInput: FC<Props> = ({
  variant,
  onSearch,
  ...forward
}) => {
  const { term, setTerm } = useSearchBarContext()

  return (
    <Input
      variant={`${variant}.input`}
      onChange={(e) => setTerm(e.target.value)}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
          onSearch(term)
        }
      }}
      {...forward}
    />
  )
}
