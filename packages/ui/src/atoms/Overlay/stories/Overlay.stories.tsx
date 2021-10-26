import type { Story, Meta } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { Props as OverlayProps } from '../Overlay'
import Component from '../Overlay'
import mdx from './Overlay.mdx'

type ColorType = 'black' | 'green'
type OverlayStoryProps = OverlayProps & { color: ColorType }

const OverlayTemplate: Story<OverlayStoryProps> = ({
  color = 'black',
  ...otherProps
}) => {
  const dataColor =
    color === 'black' ? { 'data-black': true } : { 'data-green': true }

  return (
    <div data-story-overlay-out-container>
      A content outside me
      <Component {...otherProps} {...dataColor} />
    </div>
  )
}

export const Overlay = OverlayTemplate.bind({})

const controls: ComponentArgTypes<OverlayStoryProps> = {
  color: {
    options: ['green', 'black'],
    control: {
      type: 'select',
    },
  },
}

export default {
  title: 'Atoms/Overlay',
  argTypes: {
    ...controls,
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
