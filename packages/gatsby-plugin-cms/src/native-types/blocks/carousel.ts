import type { Schema } from '../..'

export interface ICarousel {
  autoplay: boolean
  arrows: boolean
  dots: boolean
  items: Array<{
    desktop: string
    mobile: string
    alt: string
    href: string
  }>
}

export const Carousel = {
  title: 'Image carousel',
  description: '',
  type: 'object',
  properties: {
    autoplay: {
      title: 'Auto rotate images',
      type: 'boolean',
      default: false,
    },
    arrows: {
      title: 'Display arrows',
      type: 'boolean',
      default: false,
    },
    dots: {
      title: 'Display dots',
      type: 'boolean',
      default: false,
    },
    items: {
      type: 'array',
      minItems: 1,
      items: {
        title: 'Image',
        type: 'object',
        properties: {
          desktop: {
            title: 'Desktop image',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          mobile: {
            title: 'Mobile image',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          alt: {
            title: 'Image description',
            description: "Presented to users that can't see the image",
            type: 'string',
          },
          href: {
            title: 'URL address for link',
            description:
              'Where users will be taken when they click on the image',
            type: 'string',
          },
        },
      },
    },
  },
} as Schema
