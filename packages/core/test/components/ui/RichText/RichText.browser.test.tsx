/**
 * @vitest-environment jsdom
 */

import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const isContentPlatformSourceMock = vi.hoisted(() => vi.fn(() => true))

vi.mock('src/server/content/utils', () => ({
  isContentPlatformSource: isContentPlatformSourceMock,
}))

import { RichText } from '../../../../src/components/ui/RichText/RichText'

function textNode(text: string) {
  return {
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text,
    type: 'text',
    version: 1,
  }
}

function paragraphNode(children: unknown[]) {
  return {
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
  }
}

function headingNode(text: string, tag = 'h2') {
  return {
    children: [textNode(text)],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'heading',
    version: 1,
    tag,
  }
}

function linkNode(url: string, text: string) {
  return {
    children: [textNode(text)],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'link',
    version: 1,
    rel: null,
    target: null,
    title: null,
    url,
  }
}

function listNode(itemText: string) {
  return {
    children: [
      {
        children: [textNode(itemText)],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'listitem',
        version: 1,
        value: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'list',
    version: 1,
    listType: 'bullet',
    start: 1,
    tag: 'ul',
  }
}

function imageNode(overrides: Record<string, unknown> = {}) {
  return {
    type: 'image',
    version: 1,
    src: 'https://storeaccount.vtexassets.com/assets/vtex.file-manager-graphql/images/abc123.png',
    altText: 'A nice picture',
    alignment: 'center',
    widthPercent: 60,
    ...overrides,
  }
}

function lexicalContent(children: unknown[]) {
  return JSON.stringify({
    root: {
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  })
}

function draftJsContent(text: string) {
  return JSON.stringify({
    blocks: [
      {
        key: '1',
        text,
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  })
}

describe('RichText', () => {
  beforeEach(() => {
    isContentPlatformSourceMock.mockReturnValue(true)
  })

  it('renders an image node with the correct src, alt, alignment and width', () => {
    const { container } = render(
      <RichText content={lexicalContent([imageNode()])} />
    )

    const wrapper = container.querySelector('[data-fs-rich-text-image-wrapper]')
    const img = container.querySelector<HTMLImageElement>(
      '[data-fs-rich-text-image]'
    )

    expect(wrapper?.getAttribute('data-fs-rich-text-image-alignment')).toBe(
      'center'
    )
    expect(img?.getAttribute('alt')).toBe('A nice picture')
    expect(img?.getAttribute('loading')).toBe('lazy')
    expect(img?.getAttribute('style')).toBe('width: 60%;')

    const src = img?.getAttribute('src') ?? ''
    expect(src).toContain('width=432')
    expect(src).toContain('aspect=true')
    expect(src).toContain('quality=8')
  })

  it('renders images together with text, headings, links and lists in document order', () => {
    const { container } = render(
      <RichText
        content={lexicalContent([
          headingNode('Title'),
          paragraphNode([
            textNode('See '),
            linkNode('https://example.com', 'this link'),
          ]),
          listNode('An item'),
          imageNode(),
        ])}
      />
    )

    const html = container.innerHTML

    expect(container.querySelector('h2')?.textContent).toBe('Title')
    expect(
      container.querySelector('a[href="https://example.com"]')
    ).toBeTruthy()
    expect(
      container.querySelector('[data-fs-rich-text-list="true"]')
    ).toBeTruthy()
    expect(container.querySelector('[data-fs-rich-text-image]')).toBeTruthy()

    const headingIndex = html.indexOf('<h2')
    const linkIndex = html.indexOf('href="https://example.com"')
    const listIndex = html.indexOf('data-fs-rich-text-list')
    const imageIndex = html.indexOf('data-fs-rich-text-image-wrapper')

    expect(headingIndex).toBeLessThan(linkIndex)
    expect(linkIndex).toBeLessThan(listIndex)
    expect(listIndex).toBeLessThan(imageIndex)
  })

  it('drops an image node with a missing src without breaking the rest of the content', () => {
    const { container } = render(
      <RichText
        content={lexicalContent([
          paragraphNode([textNode('Before')]),
          imageNode({ src: '' }),
          paragraphNode([textNode('After')]),
        ])}
      />
    )

    expect(container.querySelector('[data-fs-rich-text-image]')).toBeNull()
    expect(
      container.querySelector('[data-fs-rich-text-image-wrapper]')
    ).toBeNull()
    expect(container.textContent).toContain('Before')
    expect(container.textContent).toContain('After')
  })

  it('does not throw and skips an image node with an unsupported/unexpected shape', () => {
    expect(() =>
      render(
        <RichText
          content={lexicalContent([
            paragraphNode([textNode('Still here')]),
            {
              type: 'image',
              version: 2,
              imageUrl: 'https://storeaccount.vtexassets.com/assets/x.png',
            },
          ])}
        />
      )
    ).not.toThrow()

    const { container } = render(
      <RichText
        content={lexicalContent([
          paragraphNode([textNode('Still here')]),
          {
            type: 'image',
            version: 2,
            imageUrl: 'https://storeaccount.vtexassets.com/assets/x.png',
          },
        ])}
      />
    )

    expect(container.querySelector('[data-fs-rich-text-image]')).toBeNull()
    expect(container.textContent).toContain('Still here')
  })

  it('renders multiple images, defaulting alignment/width when omitted and passing through non-VTEX URLs unmodified', () => {
    const { container } = render(
      <RichText
        content={lexicalContent([
          imageNode({ alignment: 'right', widthPercent: 30 }),
          imageNode({
            src: 'https://storeaccount.vtexassets.com/assets/vtex.file-manager-graphql/images/no-layout.png',
            alignment: undefined,
            widthPercent: undefined,
          }),
          imageNode({
            src: 'https://cdn.example.com/external.png',
            alignment: 'center',
            widthPercent: 80,
          }),
        ])}
      />
    )

    const wrappers = container.querySelectorAll(
      '[data-fs-rich-text-image-wrapper]'
    )
    expect(wrappers).toHaveLength(3)

    expect(wrappers[0].getAttribute('data-fs-rich-text-image-alignment')).toBe(
      'right'
    )

    expect(wrappers[1].getAttribute('data-fs-rich-text-image-alignment')).toBe(
      'left'
    )
    expect(
      wrappers[1]
        .querySelector('[data-fs-rich-text-image]')
        ?.getAttribute('style')
    ).toBe('width: 100%;')

    const externalImg = wrappers[2].querySelector('[data-fs-rich-text-image]')
    expect(externalImg?.getAttribute('src')).toBe(
      'https://cdn.example.com/external.png'
    )
  })

  it('clamps widthPercent to 100 so the image never overflows its container', () => {
    const { container } = render(
      <RichText content={lexicalContent([imageNode({ widthPercent: 150 })])} />
    )

    const img = container.querySelector('[data-fs-rich-text-image]')
    expect(img?.getAttribute('style')).toBe('width: 100%;')
  })

  it('keeps rendering existing hCMS Draft.js content unaffected', () => {
    isContentPlatformSourceMock.mockReturnValue(false)

    const { container } = render(
      <RichText content={draftJsContent('Hello legacy content')} />
    )

    expect(container.textContent).toContain('Hello legacy content')
    expect(container.querySelector('[data-fs-rich-text-image]')).toBeNull()
  })

  it('keeps rendering existing Lexical content without images unaffected', () => {
    const { container } = render(
      <RichText
        content={lexicalContent([paragraphNode([textNode('No images here')])])}
      />
    )

    expect(container.textContent).toContain('No images here')
    expect(container.querySelector('[data-fs-rich-text-image]')).toBeNull()
  })
})
