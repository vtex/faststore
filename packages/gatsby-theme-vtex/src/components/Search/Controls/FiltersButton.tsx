import {
  SearchControlsFiltersButton as StoreUISearchControlsFiltersButton,
  SearchFilterValue,
} from '@vtex/store-ui'
import React, { FC, useState, useCallback, Suspense, lazy } from 'react'

import { TreeValue } from '../Filters/types'

const SearchFiltersDrawer = lazy(() => import('../Filters/Mobile/Drawer'))

interface Props {
  variant: string
  isActive?: boolean
  specificationFilters: Array<{
    name: string
    values: SearchFilterValue[]
  }>
  brands: SearchFilterValue[]
  categoriesTrees: TreeValue[]
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
        // variant={variant}
        label="FILTERS"
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
