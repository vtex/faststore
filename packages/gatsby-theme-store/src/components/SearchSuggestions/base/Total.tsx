/** @jsx jsx */
import { FC } from 'react'
import { jsx, ButtonProps } from '@vtex/store-ui'

export const SearchSuggestionsListTotal: FC<ButtonProps> = ({
  children,
  variant,
  ...props
}) => (
  <div sx={{ variant: `suggestions.${variant}.total` }} {...(props as any)}>
    {children}
  </div>
)
