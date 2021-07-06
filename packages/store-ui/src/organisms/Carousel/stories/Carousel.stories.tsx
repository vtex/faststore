import React from 'react'
import type { Story } from '@storybook/react'

import Component from '../Carousel'
import type { CarouselProps } from '../Carousel'
import mdx from './Carousel.mdx'

const CarouselTemplate: Story<CarouselProps> = () => (
  <Component>
    <img alt="" src="https://unsplash.it/475/205" />
    <img alt="" src="https://unsplash.it/476/205" />
    <img alt="" src="https://unsplash.it/477/205" />
    <img alt="" src="https://unsplash.it/478/205" />
    <img alt="" src="https://unsplash.it/479/205" />
  </Component>
)

export const Carousel = CarouselTemplate.bind({})

export default {
  title: 'Organisms/Carousel',
  component: Carousel,
  argTypes: {},
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
