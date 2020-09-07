import React, { FC, Suspense, SuspenseProps, useState, useEffect } from 'react'

import { useDevice } from '../../sdk/media/useDevice'

interface Props extends SuspenseProps {
  device: 'mobile' | 'desktop'
}

const SuspenseDevice: FC<Props> = ({
  device: targetDevice,
  fallback,
  children,
}) => {
  const [defaultDevice, currentDevice] = useDevice()
  const [device, setDevice] = useState(defaultDevice)

  useEffect(() => {
    if (currentDevice !== defaultDevice) {
      setDevice(currentDevice)
    }
  }, [currentDevice, defaultDevice])

  if (targetDevice !== device) {
    return <>{fallback}</>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseDevice
