import { useMemo } from 'react'

import { scaleFileManagerImage } from './fileManager'

export const useScaledImage = (src: string, width: number, height: number) =>
  useMemo(() => scaleFileManagerImage(src, width, height), [src])
