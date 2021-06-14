/** @jsx jsx */
import { jsx } from 'theme-ui'
import type { FC } from 'react'
import type { ButtonProps } from 'theme-ui'

const SearchSuggestionsTotal: FC<ButtonProps> = ({
  children,
  variant,
  ...props
}) => (
  <div sx={{ variant: `suggestions.${variant}.total` }} {...(props as any)}>
    {children}
  </div>
)

export default SearchSuggestionsTotal
