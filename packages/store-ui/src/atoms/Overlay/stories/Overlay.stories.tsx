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
  ...props
}) => {
  return (
    <div data-store-overlay-out-container>
      A content outside me
      <Component {...props} className={`bg-opacity-50 bg-${color}-500`}>
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
