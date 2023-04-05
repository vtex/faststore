import { useMemo } from 'react'
import { SkuOption } from './SkuSelector'

export type Variant = 'image' | 'color' | 'label'

const getImageName = (src: string) => {
  const sourcePath = new URL(src).pathname
  const imageName = sourcePath.split('/').slice(-1)[0]
  return imageName
}

export const useDefineVariant = (options: SkuOption[], variant?: Variant): Variant =>
  useMemo(() => {
    if(variant) return variant

    const allOptionsHaveHexColor = options.every((option) => option.hexColor)
    if (allOptionsHaveHexColor) {
      return 'color'
    }

    const firstImageName = options[0]?.src && getImageName(options[0].src)

    const areSourcesEqualsOrNull = options.every((option) => {
      if (!option.src) {
        return true
      }
      const optionImageName = getImageName(option.src)
      return optionImageName === firstImageName
    })

    if (!areSourcesEqualsOrNull) {
      return 'image'
    }

    return 'label'
  }, [options, variant])
