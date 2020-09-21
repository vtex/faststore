import React, { ChangeEvent, FC, useEffect, useRef } from 'react'
import {
  Box,
  InputProps,
  usePopoverState,
  PopoverDisclosure,
  PopoverInitialState,
  Popover,
} from '@vtex/store-ui'

import { useSearchBarContext } from './hooks'

type Props = Omit<InputProps, 'ref'> & {
  popoverState?: PopoverInitialState
}

const SearchBarInput: FC<Props> = ({
  variant,
  children,
  popoverState,
  ...forward
}) => {
  const popover = usePopoverState(popoverState)
  const { syncTerm, setTerm, onSearch } = useSearchBarContext()
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (popover.visible) {
      ref.current?.focus()
    } else {
      ref.current?.blur()
    }
  }, [popover.visible])

  return (
    <Box variant={`${variant}.textInput`}>
      <PopoverDisclosure
        ref={ref}
        as="input"
        type="search"
        role="searchbox"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (typeof e.target.value === 'string') {
            setTerm(e.target.value)
          }
        }}
        onKeyUp={(e: KeyboardEvent) => {
          if (e.key === 'Enter' && syncTerm) {
            onSearch(syncTerm)
          }
        }}
        {...popover}
        {...forward}
      />
      <Popover
        tabIndex={0}
        aria-label="Searchbar Input"
        style={{ width: 'inherit', zIndex: 9 }}
        {...popover}
      >
        {popover.visible ? children : null}
      </Popover>
    </Box>
  )
}

export default SearchBarInput
