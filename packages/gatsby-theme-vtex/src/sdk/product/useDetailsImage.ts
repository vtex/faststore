import { useLocation } from '@reach/router'

import { useScaledImage } from '../img/useScaledImage'
import {
  DETAILS_IMAGE_HEIGHT,
  DETAILS_IMAGE_HEIGHT_STR,
  DETAILS_IMAGE_WIDTH,
  DETAILS_IMAGE_WIDTH_STR,
  SUMMARY_IMAGE_HEIGHT,
  SUMMARY_IMAGE_WIDTH,
} from './constants'

const IMAGE_DEFAULT =
  'https://storecomponents.vtexassets.com/assets/faststore/images/product-not-found___29e298d98dd1d0744190f12619653717.jpg'

export const useDetailsImage = (maybeSrc: string | undefined) => {
  const src = maybeSrc ?? IMAGE_DEFAULT

  const { state }: any = useLocation()
  const url = useScaledImage(src, DETAILS_IMAGE_WIDTH, DETAILS_IMAGE_HEIGHT)
  const tinyUrl = useScaledImage(src, SUMMARY_IMAGE_WIDTH, SUMMARY_IMAGE_HEIGHT)

  return {
    src: url,
    placeholder: state?.fromSummary ? tinyUrl : url,
    width: DETAILS_IMAGE_WIDTH_STR,
    height: DETAILS_IMAGE_HEIGHT_STR,
  }
}
