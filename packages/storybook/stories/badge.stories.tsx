import { Badge } from '@faststore/ui'
import type { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    variant: 'neutral',
    children: 'New arrival',
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger',
  },
}
