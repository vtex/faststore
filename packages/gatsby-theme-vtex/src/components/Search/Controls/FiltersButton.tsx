import { SearchControlsFiltersButton as StoreUISearchControlsFiltersButton } from '@vtex/store-ui'
import React, { FC, useState, useCallback, Suspense, lazy } from 'react'

const SearchFiltersDrawer = lazy(() => import('../Filters/Mobile'))

interface Props {
  variant: string
  isActive?: boolean
}

export const SearchControlsFiltersButton: FC<Props> = ({
  variant,
  ...props
}) => {
  const [active, setActive] = useState(false)
  const toggle = useCallback(() => setActive(!active), [active])

  return (
    <>
      <StoreUISearchControlsFiltersButton
        variant={variant}
        label="FILTERS "
        onClick={toggle}
      />
      {active ? (
        <Suspense fallback={null}>
          <SearchFiltersDrawer {...props} toggle={toggle} isOpen={active} />
        </Suspense>
      ) : null}
    </>
  )
}
