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
  const { syncTerm, setTerm, onSearch } = useSearchBarContext()
  const ref = useRef<HTMLInputElement>(null)
  const referenceRef = useRef<HTMLDivElement>(null)
  const popover = usePopoverState(popoverState)

  useEffect(() => {
    if (popover.visible) {
      ref.current?.focus()
    } else {
      ref.current?.blur()
    }
  }, [popover.visible])

  return (
    <Box variant={`${variant}.textInput`} ref={referenceRef}>
      <PopoverDisclosure
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
        {popover.visible ? children : null}
      </Popover>
    </Box>
  )
}

export default SearchBarInput
