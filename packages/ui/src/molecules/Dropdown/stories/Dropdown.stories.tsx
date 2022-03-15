import React, { useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { Meta, Story } from '@storybook/react'

import type { DropdownProps } from '../Dropdown'
import Dropdown from '../Dropdown'
import DropdownButton from '../DropdownButton'
import DropdownItem from '../DropdownItem'
import DropdownMenu from '../DropdownMenu'

const DropdownTemplate: Story<PropsWithChildren<DropdownProps>> = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen((old) => !old)}>
        Controlled Toggle
      </button>
      <Dropdown isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <DropdownButton>DropdownButton</DropdownButton>
        <DropdownMenu>
          <DropdownItem>DropdownItem 1</DropdownItem>
          <DropdownItem>DropdownItem 2</DropdownItem>
          <DropdownItem>DropdownItem 3</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

export const DropdownStory = DropdownTemplate.bind({})

export default {
  title: 'Molecules/Dropdown',
} as Meta
