import { useScaledImage } from '../img/useScaledImage'
import { IMAGE_DEFAULT, SUMMARY_IMAGE } from './constants'

export const useSummaryImage = (maybeSrc: string | undefined) => {
  const src = useScaledImage(
    maybeSrc ?? IMAGE_DEFAULT,
    SUMMARY_IMAGE.width,
    SUMMARY_IMAGE.height
  )

  return {
    src,
    width: SUMMARY_IMAGE.widthStr,
    height: SUMMARY_IMAGE.heightStr,
  }
}
