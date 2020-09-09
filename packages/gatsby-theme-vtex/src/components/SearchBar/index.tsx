import React, { FC, useState } from 'react'
import { Input } from '@vtex/store-ui'
import { navigate } from '@reach/router'

interface Props {
  variant: string
  placeholder: string
  'aria-label': string
}

const search = (term: string) => navigate(`/${encodeURIComponent(term)}`)

const SearchBar: FC<Props> = ({
  variant,
  placeholder,
  'aria-label': ariaLabel,
}) => {
  const [term, setTerm] = useState('')

  return (
    <>
      <Input
        onChange={(e) => setTerm(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.keyCode === 13) {
            search(term)
          }
        }}
        variant={`${variant}.search`}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </>
  )
}

export default SearchBar
