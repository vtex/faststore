import type { BannerTextProps } from '.'
import BannerText from '.'

const story = {
  component: BannerText,
  title: 'Organisms/BannerText',
  argTypes: {
    variant: { table: { disable: true } },
    actionPath: { table: { disable: true } },
  },
}

const Template = ({ ...args }: BannerTextProps) => <BannerText {...args} />

export const Primary = Template.bind({})

Primary.args = {
  title:
    'Receive our news and promotions in advance. Enjoy and get 10% off on your first purchase.',
  actionPath: '/',
  actionLabel: 'Call to action',
  colorVariant: 'main',
}

export const Secondary = Template.bind({})

Secondary.args = {
  variant: 'secondary',
  title: 'Receive our news and promotions in advance.',
  caption: 'Enjoy and get 10% off on your first purchase.',
  actionPath: '/',
  actionLabel: 'Call to action',
  colorVariant: 'accent',
}

export default story
