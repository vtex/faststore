import React, { Suspense, useState } from 'react'
import type { FC, SuspenseProps } from 'react'

import { useDevice } from './hooks/useDevice'
import { useIdleEffect } from './hooks/useIdleEffect'

type Device = ReturnType<typeof useDevice>

interface Props extends SuspenseProps {
  device: Device
}

const SuspenseDevice: FC<Props> = ({
  device: targetDevice,
  fallback,
  children,
}) => {
  const currentDevice = useDevice()
  const [device, setDevice] = useState<Device | null>(null)

  useIdleEffect(() => {
    setDevice(currentDevice)
  }, [currentDevice])

  if (targetDevice !== device) {
    return <>{fallback}</>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseDevice
