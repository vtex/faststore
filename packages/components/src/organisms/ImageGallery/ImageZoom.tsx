import type { PropsWithChildren } from 'react'
import React from 'react'

interface ImageZoomProps {
  helpMessage?: string
  zoomFactor?: number
}

const ImageZoom = ({ children }: PropsWithChildren<ImageZoomProps>) => {
  return <div>{children}</div>
}

export default ImageZoom
