/** @jsx jsx */
import { jsx, SliderArrowRight } from '@vtex/store-ui'
import { ComponentProps, FC } from 'react'

type Props = ComponentProps<typeof SliderArrowRight>

const CarouselArrowRight: FC<Props> = (props) => (
  <SliderArrowRight
    backgroundColor="transparent"
    color="black"
    aria-label="Next Product Image"
    {...props}
  />
)

export default CarouselArrowRight
