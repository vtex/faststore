import { useMemo } from 'react'

import { scaleImage } from './scale'

export const useScaledImage = (src: string, width: number, height: number) =>
  useMemo(() => scaleImage(src, width, height), [height, src, width])
