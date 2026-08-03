import { Button } from '@faststore/ui'
import type { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: 'Click',
  },
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary action',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary action',
  },
}

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Tertiary action',
  },
}
