import type { BadgeProps } from '@faststore/ui'

import { Badge } from '.'

const story = {
  component: Badge,
  title: 'Molecules/Badge/Default ⚠️',
  argTypes: {
    onClose: { table: { disable: true } },
    children: {
      name: 'content',
    },
  },
}

const Template = ({ children, ...args }: BadgeProps) => (
  <Badge {...args}>{children}</Badge>
)

export const Default = Template.bind({})
export const Actionable = Template.bind({})

Default.args = {
  children: 'New arrival',
  big: false,
  actionable: false,
  variant: 'info',
}

Actionable.args = {
  children: 'New arrival',
  big: true,
  actionable: true,
  variant: 'info',
}

export default story
