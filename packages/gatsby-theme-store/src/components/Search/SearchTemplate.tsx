/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import { FC } from 'react'

export interface Props {
  aside: JSX.Element
}

export const SearchTemplateContainer: FC = ({ children }) => (
  <div
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
    }}
  >
    {children}
  </div>
)

export const SearchTemplateAside: FC = ({ children }) => (
  <aside
    sx={{
      display: ['none', 'block'],
      flexGrow: 1,
      flexBasis: 'sidebar',
      width: 230,
    }}
  >
    {children}
  </aside>
)

export const SearchTemplateMain: FC = ({ children }) => (
  <div
    sx={{
      flexGrow: 99999,
      flexBasis: 0,
      minWidth: 300,
      ml: [0, '3rem'],
    }}
  >
    {children}
  </div>
)
