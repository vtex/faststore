import React, { FC, Fragment } from 'react'
import Box from '@material-ui/core/Box'

import Typography from '../../material-ui-components/Typography'

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
    <Typography style={{ fontSize: 12 }}>Departments</Typography>
    <Typography>{tree.Name}</Typography>
    <Box
      component="ul"
      paddingX="8px"
      style={{ marginTop: '4px', listStyleType: 'none' }}
    >
      {tree.Children.map(({ Name }, index) => (
        <li key={`tree-selector-${index}`}>
          <Typography>{Name}</Typography>
        </li>
      ))}
    </Box>
  </Fragment>
)

export default TreeSelector
