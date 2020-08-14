import { Button } from '@vtex/store-ui'
import React, { FC, lazy, Suspense, useCallback, useState } from 'react'

import { Props } from '../Desktop'

const SearchFiltersDrawer = lazy(() => import('./Drawer'))

const Icon = () => (
  <svg
    fill="none"
    width="16"
    height="16"
    viewBox="0 0 17 17"
    className=" vtex-search-result-3-x-filterIcon"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <use href="#mpa-filter-settings" xlinkHref="#mpa-filter-settings">
      <g id="mpa-filter-settings">
        <path
          d="M4 5V1"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M4 16V14"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M13 12V16"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M13 1V3"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M4 14C5.65685 14 7 12.6569 7 11C7 9.34315 5.65685 8 4 8C2.34315 8 1 9.34315 1 11C1 12.6569 2.34315 14 4 14Z"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
        <path
          d="M13 9C14.6569 9 16 7.65685 16 6C16 4.34315 14.6569 3 13 3C11.3431 3 10 4.34315 10 6C10 7.65685 11.3431 9 13 9Z"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        />
      </g>
    </use>
  </svg>
)

const SearchFilters: FC<Props> = ({ variant, ...props }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen])

  return (
    <>
      <Button variant={`${variant}.action`} onClick={toggle}>
        Filters <Icon />
      </Button>
      {isOpen ? (
        <Suspense fallback={null}>
          <SearchFiltersDrawer
            {...props}
            toggle={toggle}
            isOpen={isOpen}
            variant={variant}
          />
        </Suspense>
      ) : null}
    </>
  )
}

export default SearchFilters
