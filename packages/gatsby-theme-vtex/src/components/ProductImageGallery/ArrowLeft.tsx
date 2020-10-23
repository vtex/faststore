/** @jsx jsx */
import { jsx, SliderArrowLeft } from '@vtex/store-ui'
import { ComponentProps, FC } from 'react'

type Props = ComponentProps<typeof SliderArrowLeft>

const CarouselArrowLeft: FC<Props> = (props) => (
  <SliderArrowLeft
    backgroundColor="transparent"
    color="black"
    aria-label="Previous Product Image"
    {...props}
  />
)

export default CarouselArrowLeft
