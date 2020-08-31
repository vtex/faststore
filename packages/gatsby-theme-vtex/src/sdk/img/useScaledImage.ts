import { useMemo } from 'react'

import { scaleFileManagerImage } from './fileManager'

export const useScaledImage = (src: string, width: number, height: number) => {
  const scaled = useMemo(() => {
    return scaleFileManagerImage(src, width, height)
  }, [src])

  return scaled
}
