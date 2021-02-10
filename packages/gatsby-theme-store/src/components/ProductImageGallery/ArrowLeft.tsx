/** @jsx jsx */
import { jsx, SliderArrowLeft } from '@vtex/store-ui'
import type { ComponentProps, FC } from 'react'

type Props = ComponentProps<typeof SliderArrowLeft>

const CarouselArrowLeft: FC<Props> = (props) => (
  <SliderArrowLeft
    backgroundColor="transparent"
    color="black"
    data-testid="previousProductImage"
    aria-label="Previous Product Image"
    {...props}
  />
)

export default CarouselArrowLeft
