import React, { useState } from 'react';

import Component from '..';
import { Button } from '../../../';
import mdx from './SlideOver.mdx';

import type { Story, Meta } from '@storybook/react'

const DefaultTemplate: Story = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => setIsOpen(false)

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Open Slide Over</Button>

      <Component
        size="partial"
        direction="rightSide"
        fade="in"
        isOpen={isOpen}
        onDismiss={handleClose}
      >
        <Button onClick={handleClose}>Close Slide Over</Button>
      </Component>
    </>
  )
}

export const Default = DefaultTemplate.bind({})

export default {
  title: 'Molecules/SlideOver',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
