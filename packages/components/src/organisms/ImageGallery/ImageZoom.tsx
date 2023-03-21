import type { PropsWithChildren } from 'react'
import React from 'react'

// TODO: adds zoom feature to the selected image
export interface ImageZoomProps {
  helpMessage?: string
  zoomFactor?: number
}

const ImageZoom = ({ children }: PropsWithChildren<ImageZoomProps>) => {
  return <>{children}</>
}

export default ImageZoom
