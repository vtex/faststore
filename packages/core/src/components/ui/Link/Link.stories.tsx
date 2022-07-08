import type { LinkProps } from '.'
import Link from '.'

const story = {
  component: Link,
  title: 'Atoms/Link ⚠️',
  argTypes: {
    href: {
      type: { name: 'string', required: true },
    },
    ref: {
      table: {
        disable: true,
      },
    },
    as: {
      table: {
        disable: true,
      },
    },
    inverse: {
      control: 'boolean',
      table: { defaultValue: false },
    },
  },
}

const Template = ({ inverse, ...args }: LinkProps) =>
  inverse ? (
    <div style={{ backgroundColor: '#171a1c', padding: '10px' }}>
      <Link inverse {...args}>
        Link Inverse
      </Link>
    </div>
  ) : (
    <Link {...args}>Link</Link>
  )

export const Default = Template.bind({})

Default.args = {
  href: '#',
  variant: 'default',
  inverse: false,
}

export const Display = Template.bind({})

Display.args = {
  href: '#',
  variant: 'display',
  inverse: false,
}

export const Footer = Template.bind({})

Footer.args = {
  href: '#',
  variant: 'footer',
  inverse: false,
}

export const Inline = Template.bind({})

Inline.args = {
  href: '#',
  variant: 'inline',
  inverse: false,
}

export default story
