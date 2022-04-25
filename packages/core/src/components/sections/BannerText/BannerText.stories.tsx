import type { BannerTextProps } from '.'
import BannerText from '.'

const story = {
  component: BannerText,
  title: 'Components/BannerText',
  argTypes: {
    variant: {
      name: 'variant',
      defaultValue: 'primary',
    },
    title: {
      name: 'title',
      type: { name: 'string', required: true },
      control: {
        type: 'text',
      },
    },
    colorVariant: {
      name: 'colorVariant',
      defaultValue: 'main',
      type: { name: 'string' },
      control: {
        type: 'text',
      },
    },
  },
}

const Template = ({ ...args }: BannerTextProps) => <BannerText {...args} />

export const Primary = Template.bind({})

Primary.args = {
  title:
    'Receive our news and promotions in advance. Enjoy and get 10% off on your first purchase.',
  actionPath: '/',
  actionLabel: 'Call to action',
}

export const Secondary = Template.bind({})

Secondary.args = {
  variant: 'secondary',
  title: 'Receive our news and promotions in advance.',
  caption: 'Enjoy and get 10% off on your first purchase.',
  actionPath: '/',
  actionLabel: 'Call to action',
}

export default story
