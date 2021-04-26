/**
 * WARNING: Do not shadow this component and use Theme-ui's component
 * or any other dependency that uses React context API. If you want to
 * style or change the error page, please shadow the `pages/500.tsx` instead.
 * This component is synchronously imported and has a big TBT implication
 */
import type { FC, Dispatch, SetStateAction } from 'react'
import React, { Fragment, useState, useEffect } from 'react'
import { navigate } from 'gatsby'

import { uuidv4 } from '../../sdk/uuid'

interface Props {
  error: any
  errorId?: string
}

export const handleError = (
  { error, errorId }: Props,
  updateStateFunction: Dispatch<SetStateAction<boolean>>
) => {
  console.error(error)
  console.error(errorId)

  const isUserOffline = !window.navigator.onLine

  if (isUserOffline) {
    const previousPagePath = window.location.pathname

    navigate('/offline', {
      state: { previousPagePath },
    })

    updateStateFunction(true)

    return
  }

  // prevent infinite loop
  if (
    window.location.pathname.startsWith('/404') ||
    window.location.pathname.startsWith('/500')
  ) {
    return
  }

  window.location.href =
    error?.extensions?.exception?.status === 404
      ? `/404?from=${window.location.pathname}`
      : `/500?from=${window.location.pathname}&errorId=${errorId ?? uuidv4()}`
}

const ErrorHandler: FC<Props> = ({ error, errorId, children }) => {
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false)

  useEffect(() => {
    handleError({ error, errorId }, setShouldRenderChildren)
  }, [setShouldRenderChildren, error, errorId])

  if (shouldRenderChildren) {
    return <Fragment>{children}</Fragment>
  }

  return null
}

export default ErrorHandler
