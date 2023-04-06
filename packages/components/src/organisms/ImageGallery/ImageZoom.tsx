import React from 'react'
import type { PropsWithChildren } from 'react'

// TODO: Implements zoom feature to the selected image (Coming Soon)
export interface ImageZoomProps {
  helpMessage?: string
  zoomFactor?: number
}

const ImageZoom = ({ children }: PropsWithChildren<ImageZoomProps>) => {
  return <>{children}</>
}

export default ImageZoom
