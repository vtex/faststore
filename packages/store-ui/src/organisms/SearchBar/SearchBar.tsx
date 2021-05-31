import type { ChangeEvent } from 'react'
import React, { useRef, useState } from 'react'

import type { PopoverProps } from '../../atoms/Popover'
import Popover from '../../atoms/Popover'
import type { SearchInputProps } from '../../molecules/SearchInput'
import SearchInput from '../../molecules/SearchInput'

export type SearchBarProps = Pick<
  SearchInputProps,
  'onSubmit' | 'onChange' | 'placeholder' | 'testId'
> &
  Pick<PopoverProps, 'children'>

const SearchBar = ({
  onSubmit,
  onChange,
  children,
  placeholder,
  testId = 'store-search-bar',
}: SearchBarProps) => {
  const ref = useRef(null)
  const [value, setValue] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)

    if (onChange) {
      onChange(event)
    }
  }

  return (
    <div data-store-search-bar data-testid={testId}>
      <SearchInput
        type="text"
        ref={ref}
        placeholder={placeholder}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
      {value.length > 0 && <Popover targetRef={ref}>{children}</Popover>}
    </div>
  )
}

export default SearchBar
