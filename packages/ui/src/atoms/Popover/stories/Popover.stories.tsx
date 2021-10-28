import React, { useRef, useState } from 'react'
import type { Story } from '@storybook/react'

import Component from '../Popover'
import Input from '../../Input'
import type { PopoverProps } from '../Popover'
import mdx from './Popover.mdx'
import type { ComponentArgTypes } from '../../../typings/utils'

const PopoverTemplate: Story<PopoverProps> = ({ children }) => {
  const ref = useRef(null)
  const [value, setValue] = useState('')

  return (
    <div>
      <label>
        <span>Type for a special message</span>
        <Input
          variant={value.length > 0 ? 'success' : undefined}
          type="text"
          onChange={(event) => setValue(event.target.value)}
          ref={ref}
        />
      </label>
      {value.length > 0 && <Component targetRef={ref}>{children}</Component>}
    </div>
  )
}

export const Popover = PopoverTemplate.bind({})
Popover.args = {
  children: 'Whoa! Look at me!',
}

const argTypes: ComponentArgTypes<Omit<PopoverProps, 'targetRef'>> = {
  children: {
    table: { disable: true },
  },
}

export default {
  title: 'Atoms/Popover',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
