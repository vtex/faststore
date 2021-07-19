import React from 'react'
import type { Story } from '@storybook/react'

import type { ComponentArgTypes } from '../../../typings/utils'
import Component from '../Carousel'
import type { CarouselProps } from '../Carousel'
import mdx from './Carousel.mdx'

const CarouselTemplate: Story<CarouselProps> = ({
  itemsPerPage,
  swipeableConfigOverrides,
  testId,
}) => (
  <Component
    testId={testId}
    itemsPerPage={itemsPerPage}
    swipeableConfigOverrides={swipeableConfigOverrides}
  >
    <img alt="" width={500} src="https://source.unsplash.com/1600x900/?rio" />
    <img
      alt=""
      width={500}
      src="https://source.unsplash.com/1600x900/?sao-paulo"
    />
    <img
      alt=""
      width={450}
      src="https://source.unsplash.com/1600x900/?teresopolis"
    />
    <img
      alt=""
      width={500}
      src="https://source.unsplash.com/1600x900/?curitiba"
    />
    <img
      alt=""
      width={500}
      src="https://source.unsplash.com/1600x900/?joão-pessoa--pb"
    />
    <img
      alt=""
      width={500}
      src="https://source.unsplash.com/1600x900/?brasil"
    />
  </Component>
)

export const Carousel = CarouselTemplate.bind({})

const argTypes: ComponentArgTypes<CarouselProps> = {
  itemsPerPage: {
    control: { type: 'number', min: 1 },
    defaultValue: 1,
    min: 1,
  },
}

export default {
  title: 'Organisms/Carousel',
  component: Carousel,
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
