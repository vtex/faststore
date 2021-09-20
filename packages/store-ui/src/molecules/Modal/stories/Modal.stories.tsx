import React, { useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { Meta, Story } from '@storybook/react'

import type { ModalProps } from '..'
import Button from '../../../atoms/Button'
import Component from '../Modal'
import mdx from './Modal.mdx'

const ModalTemplate: Story<PropsWithChildren<ModalProps>> = ({
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => setIsOpen(false)

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Open Modal</Button>
      <Component
        {...props}
        isOpen={isOpen}
        aria-label="Storybook Modal"
        onDismiss={handleClose}
      >
        My Modal Content
        <br />
        <div data-action-container>
          <Button onClick={handleClose}>close</Button>
        </div>
      </Component>
    </>
  )
}

export const Modal = ModalTemplate.bind({})

export default {
  title: 'Molecules/Modal',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
