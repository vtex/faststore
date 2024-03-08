import { useMemo } from 'react'
import { SkuOption } from './SkuSelector'

export type Variant = 'image' | 'color' | 'label'

const getImageName = (src: string) => {
  const sourcePath = new URL(src).pathname
  const imageName = sourcePath.split('/').slice(-1)[0]
  return imageName
}

/**
 * This hook infers what kind of SKU Selector will be displayed on the UI. 
 * There are three different options, color, image, and label (default version).
 */
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

    /* There is currently a bug on this line. 
     *
     * If there's only one option (options.length === 1) and there is an image
     * the correct return value is 'image'. But since there's only one image
     * and they are all equal (it's equal to itself) then this conditional will
     * fail
     *
     * TODO: add a test for this case and fix it
     * */
    if (!areSourcesEqualsOrNull) {
      return 'image'
    }

    return 'label'
  }, [options, variant])
