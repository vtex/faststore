import React, { FC, Fragment } from 'react'
import Box from '@material-ui/core/Box'

interface CategoryTreeFacet {
  Name: string
  Link: string
  Children: CategoryTreeFacet[]
}

interface Props {
  tree: CategoryTreeFacet
}

const TreeSelector: FC<Props> = ({ tree }) => (
  <Fragment>
    <div style={{ fontSize: 12 }}>Departments</div>
    <div>{tree.Name}</div>
    <Box
      component="ul"
      paddingX="8px"
      style={{ marginTop: '4px', listStyleType: 'none' }}
    >
      {tree.Children.map(({ Name }, index) => (
        <li key={`tree-selector-${index}`}>{Name}</li>
      ))}
    </Box>
  </Fragment>
)

export default TreeSelector
