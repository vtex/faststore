import React from 'react'
import MaterialGrid, { GridProps } from '@material-ui/core/Grid'

// FIXME: component?
export default function Grid(
  props: GridProps & { component?: React.ElementType }
) {
  return <MaterialGrid {...props} />
}
