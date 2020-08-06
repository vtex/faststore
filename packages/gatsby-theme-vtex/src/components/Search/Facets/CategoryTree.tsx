/** @jsx jsx */
import { Link, graphql } from 'gatsby'
import { FC, Fragment } from 'react'
import { jsx } from 'theme-ui'

import { TreeSelector_TreeFragment } from './__generated__/TreeSelector_tree.graphql'

type Props = {
  tree: TreeSelector_TreeFragment
}

const TreeSelector: FC<Props> = ({ tree }) => (
  <Fragment>
    <div sx={{ fontSize: 0 }}>Departments</div>
    <div>{tree.name}</div>
    <ul
      sx={{
        mt: 1,
        px: 2,
        listStyleType: 'none',
      }}
    >
      {tree?.children?.map((child, index) => (
        <li key={`tree-selector-${index}`}>
          <Link to={child!.link}>{child!.name}</Link>
        </li>
      ))}
    </ul>
  </Fragment>
)

export const fragment = graphql`
  fragment TreeSelector_tree on VTEX_CategoriesTreeFacet {
    link
    name
    quantity
    children {
      link
      name
      quantity
    }
  }
`

export default TreeSelector
