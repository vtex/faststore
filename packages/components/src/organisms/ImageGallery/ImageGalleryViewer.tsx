import React from 'react'
import type { PropsWithChildren } from 'react'

// TODO: Implements zoom feature to the selected image (Coming Soon)
export interface ImageGalleryViewerProps {
  helpMessage?: string
  zoomFactor?: number
}

export default function ImageGalleryViewer({
  children,
}: PropsWithChildren<ImageGalleryViewerProps>) {
  return <>{children}</>
}
