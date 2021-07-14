import React from 'react'
import type { Story } from '@storybook/react'

import Component from '../Carousel'
import type { CarouselProps } from '../Carousel'
import mdx from './Carousel.mdx'

const CarouselTemplate: Story<CarouselProps> = () => (
  <Component>
    <img alt="" width={450} src="https://source.unsplash.com/1600x900/?beach" />
    <img alt="" width={450} src="https://source.unsplash.com/1600x900/?sun" />
    <img alt="" width={450} src="https://source.unsplash.com/1600x900/?rio" />
    <img
      alt=""
      width={450}
      src="https://source.unsplash.com/1600x900/?brazil"
    />
    <img
      alt=""
      width={450}
      src="https://source.unsplash.com/1600x900/?icecream"
    />
    <img
      alt=""
      width={450}
      src="https://source.unsplash.com/1600x900/?summer"
    />
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
