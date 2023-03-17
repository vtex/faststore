import { useMemo } from 'react'
import { SkuOption } from './SkuSelector'

export type Variant = 'image' | 'color' | 'label'

const getImageName = (src: string) => {
  const sourcePath = new URL(src!).pathname
  const imageName = sourcePath.split('/').at(-1)
  return imageName
}

export const useDefineVariant = (options: SkuOption[], variant?: Variant): Variant =>
  useMemo(() => {
    if(variant) return variant

    const allOptionsHaveHexColor = options.every((option) => option.hexColor)
    if (allOptionsHaveHexColor) {
      return 'color'
    }

    const firstImageName = getImageName(options[0]?.src!)

    const areSourcesEquals = options.every((option) => {
      if (!option.src) {
        return false
      }
      const optionImageName = getImageName(option.src)
      return optionImageName === firstImageName
    })

    if (!areSourcesEquals) {
      return 'image'
    }

    return 'label'
  }, [options, variant])
