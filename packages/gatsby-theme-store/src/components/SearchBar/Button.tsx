import React, { FC } from 'react'
import { Button, ButtonProps } from '@vtex/store-ui'

import { useSearchBarContext } from './hooks'

type Props = Omit<ButtonProps, 'ref'>

const MagGlass = () => (
  <svg
    fill="none"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <use href="#hpa-search" xlinkHref="#hpa-search">
      <g id="hpa-search">
        <path
          d="M15.707 13.293L13 10.586C13.63 9.536 14 8.311 14 7C14 3.14 10.859 0 7 0C3.141 0 0 3.14 0 7C0 10.86 3.141 14 7 14C8.312 14 9.536 13.631 10.586 13L13.293 15.707C13.488 15.902 13.744 16 14 16C14.256 16 14.512 15.902 14.707 15.707L15.707 14.707C16.098 14.316 16.098 13.684 15.707 13.293ZM7 12C4.239 12 2 9.761 2 7C2 4.239 4.239 2 7 2C9.761 2 12 4.239 12 7C12 9.761 9.761 12 7 12Z"
          fill="currentColor"
        />
      </g>
    </use>
  </svg>
)

const SearchBarButton: FC<Props> = ({ variant, ...forward }) => {
  const { onSearch, syncTerm } = useSearchBarContext()

  return (
    <Button
      onClick={() => syncTerm && onSearch(syncTerm)}
      variant={`${variant}.button`}
      {...forward}
    >
      <MagGlass />
    </Button>
  )
}

export default SearchBarButton
