import type { BreadcrumbProps } from '.'
import Breadcrumb from '.'

const story = {
  component: Breadcrumb,
  title: 'Molecules/Breadcrumb',
}

const breadcrumbList = [
  { item: 'technlogy', name: 'Technology', position: 1 },
  {
    item: 'technology/electronics',
    name: 'Electronics',
    position: 2,
  },
  {
    item: 'technology/electronics/audio-and-video',
    name: 'Audio & Video',
    position: 3,
  },
  {
    item: 'technology/electronics/audio-and-video/headphones',
    name: 'Headphones',
    position: 4,
  },
]

const Template = ({ children, ...args }: BreadcrumbProps) => (
  <Breadcrumb {...args}>{children}</Breadcrumb>
)

export const WithDropdown = Template.bind({})

WithDropdown.args = {
  breadcrumbList: [
    ...breadcrumbList,
    {
      item: 'technology/electronics/audio-and-video/headphones/headphonesaedle-vk1-headphone',
      name: 'Aedle VK-1 L Headphone',
      position: 5,
    },
  ],
}

export const Default = Template.bind({})

Default.args = {
  breadcrumbList,
}

export default story
