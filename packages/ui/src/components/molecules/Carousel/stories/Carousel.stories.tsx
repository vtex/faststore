import React from 'react'
import type { Story } from '@storybook/react'

import type { ComponentArgTypes } from '../../../../typings/utils'
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
      height={480}
      width="100%"
      alt="A vintage camera"
      src="https://storecomponents.vtex.app/assets/fit-in/480x480/center/middle/https%3A%2F%2Fstorecomponents.vtexassets.com%2Farquivos%2Fids%2F155481%2FFrame-3.jpg%3Fv%3D636793814536230000"
    />
    <img
      height={480}
      width="100%"
      alt="A vintage camera"
      src="https://storecomponents.vtex.app/assets/fit-in/480x480/center/middle/https%3A%2F%2Fstorecomponents.vtexassets.com%2Farquivos%2Fids%2F155481%2FFrame-3.jpg%3Fv%3D636793814536230000"
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
