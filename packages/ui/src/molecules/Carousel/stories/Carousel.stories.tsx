import React from 'react'
import type { Story } from '@storybook/react'

import type { ComponentArgTypes } from '../../../typings/utils'
import Component from '../Carousel'
import type { CarouselProps } from '../Carousel'
import mdx from './Carousel.mdx'

const CarouselTemplate: Story<
  CarouselProps & { transitionDuration: number }
> = ({ infiniteMode, controls, transitionDuration }) => (
  <Component
    infiniteMode={infiniteMode}
    controls={controls}
    transition={{ property: 'transform', duration: transitionDuration }}
  >
    <img
      alt=""
      width="100%"
      height={614}
      src="https://storecomponents.vtex.app/assets/fit-in/1280x613/center/middle/https%3A%2F%2Fstorecomponents.vtexassets.com%2Fassets%2Fvtex.file-manager-graphql%2Fimages%2F331632a0-fa52-4f08-8e45-df762d97a289___167e4c8385c3129b1a2ddab9156510ba.jpg"
    />
    <img
      alt=""
      width="100%"
      height={614}
      src="https://storecomponents.vtex.app/assets/fit-in/1280x613/center/middle/https%3A%2F%2Fstorecomponents.vtexassets.com%2Fassets%2Fvtex.file-manager-graphql%2Fimages%2Fedce348c-068c-4fb9-91f2-7d235d596e0f___b2822f893b14f87337d08f07f0e520ab.jpg"
    />
  </Component>
)

export const Carousel = CarouselTemplate.bind({})

const argTypes: ComponentArgTypes<
  CarouselProps & { transitionDuration: number }
> = {
  controls: {
    type: 'select',
    options: ['complete', 'paginationBullets', 'navigationArrows'],
    defaultValue: 'complete',
  },
  transitionDuration: {
    type: 'number',
    defaultValue: 400,
  },
}

export default {
  title: 'Molecules/Carousel',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
