/** @jsx jsx */
import { jsx, SliderArrowRight } from '@vtex/store-ui'
import type { ComponentProps, FC } from 'react'

type Props = ComponentProps<typeof SliderArrowRight>

const CarouselArrowRight: FC<Props> = (props) => (
  <SliderArrowRight
    backgroundColor="transparent"
    color="black"
    data-testid="nextProductImage"
    aria-label="Next Product Image"
    {...props}
  />
)

export default CarouselArrowRight
