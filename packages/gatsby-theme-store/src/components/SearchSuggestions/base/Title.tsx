/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import type { FC } from 'react'

interface Props {
  title: string
  variant: string
}

export const SearchSuggestionsListTitle: FC<Props> = ({ title, variant }) => (
  <span sx={{ variant: `suggestions.${variant}.title` }}>{title}</span>
)
