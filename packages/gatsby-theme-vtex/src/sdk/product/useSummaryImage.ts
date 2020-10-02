import { useScaledImage } from '../img/useScaledImage'
import {
  SUMMARY_IMAGE_HEIGHT,
  SUMMARY_IMAGE_HEIGHT_STR,
  SUMMARY_IMAGE_WIDTH,
  SUMMARY_IMAGE_WIDTH_STR,
} from './constants'

export const IMAGE_DEFAULT =
  'https://tudoparasuaempresa.com.br/assets/img/!product-image.jpg'

export const useSummaryImage = (maybeSrc: string | undefined) => {
  const src = useScaledImage(
    maybeSrc ?? IMAGE_DEFAULT,
    SUMMARY_IMAGE_WIDTH,
    SUMMARY_IMAGE_HEIGHT
  )

  return {
    src,
    width: SUMMARY_IMAGE_WIDTH_STR,
    height: SUMMARY_IMAGE_HEIGHT_STR,
  }
}
