/** @jsx jsx */
import { Link } from 'gatsby'
import { FC, Fragment } from 'react'
import { jsx } from 'theme-ui'

interface Node {
  link: string
  name: string
  quantity: number
  children: Node[]
}

type Props = {
  tree: Node
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
      {tree.children.map((child, index) => (
        <Link to={child.link} key={`tree-selector-${index}`}>
          <li sx={{ minHeight: '48px', minWidth: '48px' }}>{child.name}</li>
        </Link>
      ))}
    </ul>
  </Fragment>
)

export default TreeSelector
