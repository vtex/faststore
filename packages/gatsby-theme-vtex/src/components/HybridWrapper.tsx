import React, { FC, Suspense, SuspenseProps } from 'react'
import { Box } from '@vtex/store-ui'

import { isServer } from '../utils/env'

interface Props extends SuspenseProps {
  isPrerendered: boolean
}

const HybridWrapper: FC<Props> = ({ fallback, isPrerendered, children }) => {
  if (isServer) {
    if (isPrerendered) {
      return <Box>{children}</Box>
    }

    return <Box>{fallback}</Box>
  }

  return (
    <Suspense fallback={fallback}>
      <Box>{children}</Box>
    </Suspense>
  )
}

export default HybridWrapper
