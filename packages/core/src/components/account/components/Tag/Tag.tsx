import type { ReactNode } from 'react'

export type TagProps = {
  children: ReactNode
}

const Tag = ({ children, ...otherProps }: TagProps) => (
  <span data-fs-tag {...otherProps}>
    {children}
  </span>
)

export default Tag
