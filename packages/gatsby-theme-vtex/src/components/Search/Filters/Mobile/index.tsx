import { Box, ToggleButton, Value } from '@vtex/store-ui'
import React, { FC, lazy, Suspense } from 'react'

import { TreeValue } from '../types'
import Icon from './Icon'

const SearchFiltersDrawer = lazy(() => import('./Drawer'))

interface Props {
  variant: string
  isActive?: boolean
  specificationFilters: Array<{
    name: string
    values: Value[]
  }>
  brands: Value[]
  categoriesTrees: TreeValue[]
}

const SearchFilters: FC<Props> = ({ variant, ...props }) => (
  <ToggleButton variant={`${variant}.action`} defaultActive={false}>
    {({ active, toggle }) => (
      <Box>
        Filters <Icon />
        {active ? (
          <Suspense fallback={null}>
            <SearchFiltersDrawer
              {...props}
              toggle={toggle}
              isOpen={active}
              variant={variant}
            />
          </Suspense>
        ) : null}
      </Box>
    )}
  </ToggleButton>
)

export default SearchFilters
