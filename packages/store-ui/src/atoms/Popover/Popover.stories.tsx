import type { Meta, Story } from '@storybook/react'
import React, { useRef, useState } from 'react'

import Input from '../Input'
import type { PopoverProps } from './Popover'
import Root from './Popover'

export default {
  title: 'Atoms/Popover',
} as Meta

const PopoverTemplate: Story<PopoverProps> = (args) => {
  const ref = useRef<any>(null)
  const [value, setValue] = useState('')

  return (
    <div>
      <label>
        <span>Type for a special message</span>
        <Input
          type="text"
          ref={ref}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>

      {value.length > 0 && (
        <Root {...args} targetRef={ref}>
          <div>
            <p>Whoa! Look at me!</p>
          </div>
        </Root>
      )}
    </div>
  )
}

export const Popover = PopoverTemplate.bind({})
Popover.args = {
  children: <div>Popover BOdy</div>,
}
