import React, { useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { Meta, Story } from '@storybook/react'

import { Caret } from './assets/Caret'
import Button from '../../../atoms/Button'
import type { DropdownProps } from '..'
import Dropdown, { DropdownButton, DropdownItem, DropdownMenu } from '..'
import mdx from './Dropdown.mdx'

const DropdownUncontrolledTemplate: Story<
  PropsWithChildren<DropdownProps>
> = () => {
  return (
    <>
      <Dropdown>
        <DropdownButton>Dropdown Button</DropdownButton>
        <DropdownMenu>
          <DropdownItem onClick={() => console.log('Item 1')}>
            Dropdown Item 1
          </DropdownItem>
          <DropdownItem onClick={() => console.log('Item 2')}>
            Dropdown Item 2
          </DropdownItem>
          <DropdownItem onClick={() => console.log('Item 3')}>
            Dropdown Item 3
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

export const Uncontrolled = DropdownUncontrolledTemplate.bind({})

const DropdownControlledTemplate: Story<
  PropsWithChildren<DropdownProps>
> = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen((old) => !old)}>Simple Button</Button>
      <Dropdown isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <DropdownButton>DropdownButton</DropdownButton>
        <DropdownMenu>
          <DropdownItem>Dropdown Item 1</DropdownItem>
          <DropdownItem>Dropdown Item 2</DropdownItem>
          <DropdownItem>Dropdown Item 3</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

export const Controlled = DropdownControlledTemplate.bind({})

const DropdownSelectableTemplate: Story<
  PropsWithChildren<DropdownProps>
> = () => {
  const [value, setValue] = useState('Selectable')

  return (
    <>
      <Dropdown>
        <DropdownButton>
          {value} <Caret />
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem onClick={() => setValue('Value 1')}>
            Value 1
          </DropdownItem>
          <DropdownItem onClick={() => setValue('Value 2')}>
            Value 2
          </DropdownItem>
          <DropdownItem onClick={() => setValue('Value 3')}>
            Value 3
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

export const Selectable = DropdownSelectableTemplate.bind({})

export default {
  title: 'Molecules/Dropdown',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
