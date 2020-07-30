import React from 'react'
import { Grid as MaterialGrid, GridProps } from '@material-ui/core'

// FIXME: component?
export default function Grid(
  props: GridProps & { component?: React.ElementType }
) {
  return <MaterialGrid {...props} />
}
