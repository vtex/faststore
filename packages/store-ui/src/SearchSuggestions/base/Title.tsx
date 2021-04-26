/** @jsx jsx */
import { jsx } from 'theme-ui'
import type { FC } from 'react'

interface Props {
  variant: string
}

const SearchSuggestionsTitle: FC<Props> = ({ children, variant }) => (
  <span sx={{ variant: `suggestions.${variant}.title` }}>{children}</span>
)

export default SearchSuggestionsTitle
