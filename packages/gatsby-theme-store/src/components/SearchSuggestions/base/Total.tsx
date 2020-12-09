/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import type { FC } from 'react'
import type { ButtonProps } from '@vtex/store-ui'

export const SearchSuggestionsListTotal: FC<ButtonProps> = ({
  children,
  variant,
  ...props
}) => (
  <div sx={{ variant: `suggestions.${variant}.total` }} {...(props as any)}>
    {children}
  </div>
)
