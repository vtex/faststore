/** @jsx jsx */
import { FC } from 'react'
import { jsx } from '@vtex/store-ui'

interface Props {
  title: string
  variant: string
}

export const SearchSuggestionsListTitle: FC<Props> = ({ title, variant }) => (
  <span sx={{ variant: `suggestions.${variant}.title` }}>{title}</span>
)
