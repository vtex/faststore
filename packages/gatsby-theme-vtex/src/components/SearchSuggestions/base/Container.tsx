/** @jsx jsx */
import { FC } from 'react'
import { jsx } from '@vtex/store-ui'

interface Props {
  variant: string
}

export const SearchSuggestionsListContainer: FC<Props> = ({
  variant,
  children,
}) => <div sx={{ variant: `suggestions.${variant}` }}>{children}</div>
