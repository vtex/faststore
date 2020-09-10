import React, { FC, Suspense, SuspenseProps, useState, useEffect } from 'react'

import { useDevice } from '../../sdk/media/useDevice'

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

  useEffect(() => {
    setDevice(currentDevice)
  }, [currentDevice])

  if (targetDevice !== device) {
    return <>{fallback}</>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseDevice
