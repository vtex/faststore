/** @jsx jsx */
import { FC, Suspense } from 'react'
import { jsx } from '@vtex/store-ui'

interface Props {
  variant: string
  fallback?: JSX.Element | null
}

export const SearchSuggestionsListContainer: FC<Props> = ({
  variant,
  children,
  fallback = null,
}) => (
  <div sx={{ variant: `suggestions.${variant}` }}>
    <Suspense fallback={fallback}>{children}</Suspense>
  </div>
)
