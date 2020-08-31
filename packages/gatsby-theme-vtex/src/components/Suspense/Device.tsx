import React, { FC, Suspense, SuspenseProps } from 'react'

import { useDevice } from '../../sdk/media/useDevice'

interface Props extends SuspenseProps {
  device: 'mobile' | 'desktop'
}

const SuspenseDevice: FC<Props> = ({ fallback, children, device }) => {
  const currentDevice = useDevice()

  if (currentDevice !== device) {
    return <>{fallback}</>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseDevice
