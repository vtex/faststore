/** @jsx jsx */
import { FC, Fragment } from 'react'
import { jsx } from 'theme-ui'
import { Link } from 'gatsby'

interface CategoryTreeFacet {
  name: string
  link: string
  children: CategoryTreeFacet[]
}

interface Props {
  tree: CategoryTreeFacet
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
      {tree.children.map(({ name, link }, index) => (
        <li key={`tree-selector-${index}`}>
          <Link to={link}>{name}</Link>
        </li>
      ))}
    </ul>
  </Fragment>
)

export default TreeSelector
