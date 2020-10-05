import { useScaledImage } from '../img/useScaledImage'
import {
  SUMMARY_IMAGE_HEIGHT,
  SUMMARY_IMAGE_HEIGHT_STR,
  SUMMARY_IMAGE_WIDTH,
  SUMMARY_IMAGE_WIDTH_STR,
} from './constants'

const IMAGE_DEFAULT =
  'https://storecomponents.vtexassets.com/assets/faststore/images/product-not-found___29e298d98dd1d0744190f12619653717.jpg'

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
