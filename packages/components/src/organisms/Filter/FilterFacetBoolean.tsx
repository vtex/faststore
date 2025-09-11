import React, { type ReactNode } from 'react'
import { List } from '../../'

export default function FilterFacetBoolean({
  children,
}: { children: ReactNode }) {
  return <List data-fs-filter-list>{children}</List>
}
