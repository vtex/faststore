import { SearchFilterValue, Button } from '@vtex/store-ui'
import React, { FC, lazy, Suspense, useState, useCallback } from 'react'

import { TreeValue } from '../types'
import Icon from './Icon'

const SearchFiltersDrawer = lazy(() => import('./Drawer'))

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

const SearchFilters: FC<Props> = ({ variant, ...props }) => {
  const [active, setActive] = useState(false)
  const toggle = useCallback(() => setActive(!active), [active])

  return (
    <>
      <Button variant="controls.filterAction" onClick={toggle}>
        Filters <Icon />
      </Button>
      {active ? (
        <Suspense fallback={null}>
          <SearchFiltersDrawer {...props} toggle={toggle} isOpen={active} />
        </Suspense>
      ) : null}
    </>
  )
}

export default SearchFilters
