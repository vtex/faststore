import sanitizeHtmlLib from 'sanitize-html'

/**
 * This list was taken from Store Framework's Product Description app.
 * https://github.com/vtex-apps/store-components/blob/master/react/ProductDescription.tsx
 * 
 * This is a time-tested set of options that already works with the whole customer base of VTEX
 * customers using Store Framework.
 */
const allowedTags = [
  'a',
  'abbr',
  'article',
  'b',
  'blockquote',
  'br',
  'caption',
  'code',
  'del',
  'details',
  'div',
  'em',
  'figure',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'header',
  'footer',
  'i',
  'img',
  'ins',
  'iframe',
  'kbd',
  'li',
  'main',
  'mark',
  'ol',
  'p',
  'picture',
  'pre',
  'section',
  'source',
  'span',
  'strike',
  'strong',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
  'link',
  'body',
  'html',
  'style',
  'link',
  'script',
  'head',
  'meta',
  'object',
  'embed',
]

const allowedAttributes = {
  '*': [
    'id',
    'title',
    'accesskey',
    'class',
    'style',
    'aria-label',
    'width',
    'height',
    'hidden',
  ],
  a: ['href', 'name', 'target'],
  iframe: ['allow', 'allowfullscreen', 'frameborder', 'src'],
  img: ['src', 'alt'],
  link: ['rel', 'type', 'href'],
  td: ['colspan', 'rowspan', 'headers'],
  meta: ['charset', 'name', 'content'],
  object: ['type', 'height', 'width', 'data'],
  embed: ['height', 'width', 'src'],
}

const allowedSchemes = ['http', 'https', 'mailto', 'tel']

const allowedClasses = {}

export const sanitizeHtml = (
  dirty: Parameters<typeof sanitizeHtmlLib>[0],
  options?: Parameters<typeof sanitizeHtmlLib>[1]
) =>
  sanitizeHtmlLib(dirty, {
    ...(options ?? {}),
    allowedTags,
    allowedAttributes,
    allowedClasses,
    allowedSchemes,
  })
