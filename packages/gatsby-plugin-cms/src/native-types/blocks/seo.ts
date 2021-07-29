import type { Schema } from '../..'

export interface ISeo {
  title: string
  slug: string
  description: string
}

export const Seo = {
  type: 'object',
  title: 'Seo',
  widget: {
    'ui:ObjectFieldTemplate': 'GoogleSeoPreview',
  },
  required: ['title', 'description', 'slug'],
  properties: {
    title: {
      type: 'string',
      title: 'Title',
      description:
        'Appears in the browser tab and is suggested for search engines',
      default: 'Page title',
    },
    slug: {
      type: 'string',
      title: 'URL slug',
      description: "Final part of the page's address. No spaces allowed.",
      default: '/path/to/page',
      pattern: '^/([a-zA-Z0-9]|-|/|_)*',
    },
    description: {
      type: 'string',
      title: 'Description (Meta description)',
      description: 'Suggested for search engines',
      default: 'Page description',
    },
  },
} as Schema
