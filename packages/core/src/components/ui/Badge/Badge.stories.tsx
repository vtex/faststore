import type { BadgeProps } from '@faststore/ui'

import { Badge } from '.'

const story = {
  component: Badge,
  title: 'Components/Badge',
}

const Template = ({ children, ...args }: BadgeProps) => (
  <Badge {...args}>{children}</Badge>
)

export const Default = Template.bind({})

Default.args = {
  children: 'New arrival',
  big: true,
  interactive: true,
  variant: 'info',
}

export default story
