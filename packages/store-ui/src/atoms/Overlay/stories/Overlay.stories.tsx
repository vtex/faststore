import type { Meta, Story } from '@storybook/react'
import React from 'react'
import type { ComponentArgTypes } from 'typings/utils'

import type { Props as OverlayProps } from '../Overlay'
import Component from '../Overlay'
import mdx from './Overlay.mdx'

type ColorType = 'black' | 'green'
type OverlayStoryProps = OverlayProps & { color: ColorType }

const OverlayTemplate: Story<OverlayStoryProps> = ({
  color = 'black',
  ...props
}) => {
  const dataColor =
    color === 'black' ? { 'data-black': true } : { 'data-green': true }

  return (
    <div data-store-overlay-out-container>
      A content outside me
      <Component {...props} {...dataColor}>
        <div data-store-overlay-modal>
          <div data-store-overlay-modal-content>Scroll me</div>
        </div>
      </Component>
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
  component: Overlay,
  argTypes: {
    ...controls,
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
