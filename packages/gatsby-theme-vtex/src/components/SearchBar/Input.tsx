import React, { ChangeEvent, FC, useCallback, useEffect, useRef } from 'react'
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
  const { syncTerm, setTerm, onSearch } = useSearchBarContext()
  const ref = useRef<HTMLInputElement>(null) // reference input
  const referenceRef = useRef<HTMLDivElement>(null) // reference container
  const { toggle: t, ...popover } = usePopoverState(popoverState)
  const { show, visible } = popover

  // When clicking in the input, always open but never close
  // search autocomplete
  const toggle = useCallback(() => {
    if (!visible) {
      show()
    }
  }, [show, visible])

  useEffect(() => {
    // Focus input when input is clicked
    if (popover.visible) {
      ref.current?.focus()
    }
    // Blurs input when user clicks away
    else {
      ref.current?.blur()
    }
  }, [popover.visible])

  return (
    <Box variant={`${variant}.textInput`} ref={referenceRef}>
      <PopoverDisclosure
        toggle={toggle}
        as="input"
        type="search"
        role="searchbox"
        {...forward}
        {...popover}
        ref={ref}
        unstable_referenceRef={referenceRef}
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
        aria-expanded={null}
      />
      <Popover tabIndex={0} aria-label="Searchbar Input" {...popover}>
        {visible ? children : null}
      </Popover>
    </Box>
  )
}

export default SearchBarInput
