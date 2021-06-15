/**
 * WARNING: Do not shadow this component and use Theme-ui's component
 * or any other dependency that uses React context API. If you want to
 * style or change the error page, please shadow the `pages/500.tsx` instead.
 * This component is synchronously imported and has a big TBT implication
 */
import { useEffect } from 'react'
import type { FC } from 'react'

import { uuidv4 } from '../../sdk/uuid'

interface Props {
  error: any
  errorId?: string
}

export const handleError = ({ error, errorId }: Props) => {
  console.error(error)
  console.error(errorId)

  // prevent infinite loop
  if (
    window.location.pathname.startsWith('/404') ||
    window.location.pathname.startsWith('/500') ||
    window.location.pathname.startsWith('/offline')
  ) {
    return
  }

  const from = encodeURIComponent(window.location.pathname)

  const isOffline = !window.navigator.onLine
  const is404 = error?.extensions?.exception?.status === 404
  const isFrameworkLevelError = error.name === 'ChunkLoadError'

  if (isFrameworkLevelError) {
    window.location.reload()
  } else if (isOffline) {
    window.location.href = `/offline?from=${from}`
  } else if (is404) {
    window.location.href = `/404?from=${from}`
  } else {
    window.location.href = `/500?from=${from}&errorId=${errorId ?? uuidv4()}`
  }
}

const ErrorHandler: FC<Props> = ({ error, errorId }) => {
  useEffect(() => {
    handleError({ error, errorId })
  }, [error, errorId])

  return null
}

export default ErrorHandler
