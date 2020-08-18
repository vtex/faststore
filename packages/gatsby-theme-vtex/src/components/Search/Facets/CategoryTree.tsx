/** @jsx jsx */
import { FC, Fragment } from 'react'
import { jsx, Box, LocalizedLink } from '@vtex/store-ui'
// import { FormattedMessage } from 'react-intl'
import { t } from 'frenchkiss'

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
    {/* <FormattedMessage id="facets.tree-selector.title" /> */}
    <div>{t('facets.tree-selector.title')}</div>
    <div>{tree.name}</div>
    <ul
      sx={{
        mt: 1,
        px: 2,
        listStyleType: 'none',
      }}
    >
      {tree.children.map((child, index) => (
        <li key={`tree-selector-${index}`}>
          <LocalizedLink to={child.link}>
            <Box sx={{ minHeight: '48px', minWidth: '48px' }}>{child.name}</Box>
          </LocalizedLink>
        </li>
      ))}
    </ul>
  </Fragment>
)

export default TreeSelector
