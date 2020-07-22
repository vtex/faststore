/** @jsx jsx */
import { FC, Fragment } from 'react'
import { jsx } from 'theme-ui'

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
    <div sx={{ fontSize: 0 }}>Departments</div>
    <div>{tree.Name}</div>
    <ul sx={{ mt: 1, px: 2, listStyleType: 'none' }}>
      {tree.Children.map(({ Name }, index) => (
        <li key={`tree-selector-${index}`}>{Name}</li>
      ))}
    </ul>
  </Fragment>
)

export default TreeSelector
