/** @jsx jsx */
import { Suspense } from 'react'
import { jsx } from '@vtex/store-ui'
import type { FC } from 'react'

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
