import React from 'react'
import type { Story } from '@storybook/react'

import type { ComponentArgTypes } from '../../../typings/utils'
import Component from '../Carousel'
import type { CarouselProps } from '../Carousel'
import mdx from './Carousel.mdx'

const CarouselTemplate: Story<CarouselProps> = ({
  infiniteMode,
  showNavigationArrows,
  showPaginationBullets,
}) => (
  <Component
    infiniteMode={infiniteMode}
    showNavigationArrows={showNavigationArrows}
    showPaginationBullets={showPaginationBullets}
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

const argTypes: ComponentArgTypes<CarouselProps> = {
  // infiniteMode: {
  //   control: { type: 'boolean'  },
  //   defaultValue: true,
  // },
  showNavigationArrows: {
    control: { type: 'boolean' },
    defaultValue: true,
  },
  showPaginationBullets: {
    control: { type: 'boolean' },
    defaultValue: true,
  },
}

export default {
  title: 'Molecules/Carousel',
  component: Carousel,
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
