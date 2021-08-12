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
  const styleMap = {
    green: {
      backgroundColor: 'rgba(0, 255, 0, 0.5)',
    },
    black: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  }

  return (
    <div style={{ height: 'calc(100vh + 150px)' }}>
      A content outside me
      <Component
        {...props}
        style={{
          zIndex: 10,
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          // styles that don't be part of the overlay behavior
          ...styleMap[color],
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{ maxHeight: '40px', overflow: 'auto', borderRadius: '6px' }}
        >
          <div
            style={{
              backgroundColor: 'white',
              width: '150px',
              height: '60px',
              padding: '10px',
            }}
          >
            Scroll me
          </div>
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
