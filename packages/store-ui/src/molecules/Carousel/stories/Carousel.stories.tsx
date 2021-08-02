import React from 'react'
import type { Story } from '@storybook/react'

import Component from '../Carousel'
import type { CarouselProps } from '../Carousel'
import mdx from './Carousel.mdx'

const CarouselTemplate: Story<CarouselProps> = () => (
  <Component>
    <img alt="" width="100%" src="https://source.unsplash.com/1600x900/?rio" />
    <img
      alt=""
      width="100%"
      src="https://source.unsplash.com/1600x900/?sao-paulo"
    />
    <img
      alt=""
      width="100%"
      src="https://source.unsplash.com/1600x900/?teresopolis"
    />
    <img
      alt=""
      width="100%"
      src="https://source.unsplash.com/1600x900/?curitiba"
    />
    <img
      alt=""
      width="100%"
      src="https://source.unsplash.com/1600x900/?joão-pessoa--pb"
    />
    <img
      alt=""
      width="100%"
      src="https://source.unsplash.com/1600x900/?brasil"
    />
  </Component>
)

export const Carousel = CarouselTemplate.bind({})

export default {
  title: 'Molecules/Carousel',
  component: Carousel,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
