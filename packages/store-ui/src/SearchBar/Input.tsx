import React, { useCallback, useEffect, useRef } from 'react'
import type { ChangeEvent, FC } from 'react'
import { Box } from 'theme-ui'
import type { InputProps } from 'theme-ui'
import { Popover, PopoverDisclosure, usePopoverState } from 'reakit/Popover'
import type { PopoverInitialState } from 'reakit/Popover'
// TODO: We should remove this import since a base store component that depends on our
// routing system makes no sense and may create all sorts of wierd bugs 🐞🐞🐞
// When doing this change, do not forget to remove @reach/router dependency from @vtex/store-ui
// import { useLocation } from '@reach/router'

import { useSearchBarContext } from './hooks/useSearchBarContext'

type Props = Omit<InputProps, 'ref'> & {
  popoverState?: PopoverInitialState
}

const SearchBarInput: FC<Props> = ({
  variant,
  children,
  popoverState,
  ...forward
}) => {
  // const location = useLocation()
  const { syncTerm, setTerm, onSearch } = useSearchBarContext()
  const ref = useRef<HTMLInputElement>(null) // reference input
  const referenceRef = useRef<HTMLDivElement>(null) // reference container
  const { toggle: t, ...popover } = usePopoverState(popoverState)
  const { show, visible, hide } = popover

  // // Close it whenever the page changes
  // useEffect(() => {
  //   hide()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [location.pathname])

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
      <Popover
        tabIndex={0}
        aria-label="Searchbar Input"
        {...popover}
        style={{ position: 'relative', top: '0px', left: '0px' }}
      >
        {visible ? children : null}
      </Popover>
    </Box>
  )
}

export default SearchBarInput
