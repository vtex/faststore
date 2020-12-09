import { useResponsiveValue } from '@theme-ui/match-media'

import { useSlider } from './useSlider'
import type { UseSliderOptions } from './useSlider'

export interface UseResponsiveSliderOptions<T>
  extends Omit<UseSliderOptions<T>, 'pageSize'> {
  pageSizes: number[]
  defaultIndex: number
}

export const useResponsiveSlider = <T>({
  pageSizes,
  defaultIndex,
  ...rest
}: UseResponsiveSliderOptions<T>) => {
  const pageSize = useResponsiveValue(pageSizes, { defaultIndex })

  const slider = useSlider({
    ...rest,
    pageSize,
  })

  return {
    ...slider,
    pageSize,
  }
}
