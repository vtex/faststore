import type { BadgeProps } from '@faststore/ui'

import { Badge } from '.'

const story = {
  component: Badge,
  title: 'Molecules/Badge',
  argTypes: {
    onClose: { table: { disable: true } },
  },
}

const Template = ({ children, ...args }: BadgeProps) => (
  <Badge {...args}>{children}</Badge>
)

export const Default = Template.bind({})
export const Interactive = Template.bind({})

Default.args = {
  children: 'New arrival',
  big: false,
  interactive: false,
  variant: 'info',
}

Interactive.args = {
  children: 'New arrival',
  big: true,
  interactive: true,
  variant: 'info',
}

export default story
