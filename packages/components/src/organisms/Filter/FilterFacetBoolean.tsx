import React, { ReactNode } from 'react'
import { List } from '../../'

function FilterFacetBoolean({ children }: { children: ReactNode }) {
  return <List data-fs-filter-list>{children}</List>
}

export default FilterFacetBoolean
