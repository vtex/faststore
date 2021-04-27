/** @jsx jsx */
import { Suspense } from 'react'
import { jsx } from 'theme-ui'
import type { FC } from 'react'

interface Props {
  variant: string
  fallback?: JSX.Element | null
}

const SearchSuggestionsContainer: FC<Props> = ({
  variant,
  children,
  fallback = null,
}) => (
  <div sx={{ variant: `suggestions.${variant}` }}>
    <Suspense fallback={fallback}>{children}</Suspense>
  </div>
)

export default SearchSuggestionsContainer
