import { HelmetProvider } from 'react-helmet-async'

import Icon from 'src/components/ui/Icon'

import type { HeroProps } from '.'
import Hero from '.'

const story = {
  component: Hero,
  title: 'Organisms/Hero',
  argTypes: {
    link: { table: { disable: true } },
    imageAlt: { table: { disable: true } },
    variant: { table: { disable: true } },
  },
}

const Template = ({ ...args }: HeroProps) => (
  <HelmetProvider>
    <Hero {...args} />
  </HelmetProvider>
)

export const Primary = Template.bind({})

Primary.args = {
  title: 'New Products Available',
  subtitle:
    'At BaseStore you can shop the best tech of 2022. Enjoy and get 10% off on your first purchase.',
  link: '/',
  linkText: 'See all',
  imageSrc:
    'https://storeframework.vtexassets.com/arquivos/ids/190897/Photo.jpg',
  imageAlt: 'Quest 2 Controller on a table',
  variant: 'primary',
  colorVariant: 'main',
}

export const Secondary = Template.bind({})

Secondary.args = {
  title: 'New Products Available',
  subtitle:
    'At BaseStore you can shop the best tech of 2022. Enjoy and get 10% off on your first purchase.',
  link: '/',
  linkText: 'See all',
  imageSrc:
    'https://storeframework.vtexassets.com/arquivos/ids/190897/Photo.jpg',
  imageAlt: 'Quest 2 Controller on a table',
  variant: 'secondary',
  colorVariant: 'light',
  icon: <Icon name="Headphones" width={48} height={48} weight="thin" />,
}

export default story
