import React, { FC, useEffect, useRef } from 'react'
import {
  Box,
  Input,
  InputProps,
  usePopoverState,
  PopoverDisclosure,
  Popover,
} from '@vtex/store-ui'

import { useSearchBarContext } from './hooks'

type Props = Omit<InputProps, 'ref'>

const SearchBarInput: FC<Props> = ({ variant, children, ...forward }) => {
  const popover = usePopoverState({ placement: 'bottom-start' })
  const { term, setTerm, onSearch } = useSearchBarContext()
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (popover.visible) {
      ref.current?.focus()
    }
  }, [popover.visible])

  return (
    <Box variant={`${variant}.textInput`}>
      <PopoverDisclosure {...popover}>
        <Input
          ref={ref}
          onChange={(e) => {
            setTerm(e.target.value)
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter' && term) {
              onSearch(term)
            }
          }}
          {...forward}
        />
      </PopoverDisclosure>
      <Popover
        tabIndex={0}
        aria-label="Searchbar Input"
        style={{ width: 'inherit' }}
        {...popover}
      >
        {popover.visible ? children : null}
      </Popover>
    </Box>
  )
}

export default SearchBarInput
