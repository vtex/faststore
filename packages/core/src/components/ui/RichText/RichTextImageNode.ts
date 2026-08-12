import {
  DecoratorNode,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalEditor,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from 'lexical'

export type ImageAlignment = 'left' | 'center' | 'right'

export type SerializedRichTextImageNode = Spread<
  {
    type: 'image'
    version: 1
    src: string
    altText: string
    alignment: ImageAlignment
    widthPercent: number
  },
  SerializedLexicalNode
>

const VALID_ALIGNMENTS: ImageAlignment[] = ['left', 'center', 'right']
const DEFAULT_ALIGNMENT: ImageAlignment = 'left'
const DEFAULT_WIDTH_PERCENT = 100
const RICH_TEXT_CONTENT_MAX_WIDTH = 720
const DEFAULT_IMAGE_QUALITY = 8

function resolveAlignment(alignment: unknown): ImageAlignment {
  return VALID_ALIGNMENTS.includes(alignment as ImageAlignment)
    ? (alignment as ImageAlignment)
    : DEFAULT_ALIGNMENT
}

function resolveWidthPercent(widthPercent: unknown): number {
  if (typeof widthPercent !== 'number' || widthPercent <= 0) {
    return DEFAULT_WIDTH_PERCENT
  }

  return Math.min(widthPercent, DEFAULT_WIDTH_PERCENT)
}

function withVtexResizeParams(src: string, widthPercent: number): string {
  if (!src.includes('vtexassets') || !src.includes('/assets')) {
    return src
  }

  try {
    const url = new URL(src)
    const targetWidth = Math.max(
      1,
      Math.round((RICH_TEXT_CONTENT_MAX_WIDTH * widthPercent) / 100)
    )

    url.searchParams.set('width', targetWidth.toString())
    url.searchParams.set('aspect', 'true')
    url.searchParams.set('quality', DEFAULT_IMAGE_QUALITY.toString())

    return url.toString()
  } catch {
    return src
  }
}

export class RichTextImageNode extends DecoratorNode<null> {
  __src: string
  __altText: string
  __alignment: ImageAlignment
  __widthPercent: number

  constructor(
    src: string,
    altText: string,
    alignment: ImageAlignment = DEFAULT_ALIGNMENT,
    widthPercent: number = DEFAULT_WIDTH_PERCENT,
    key?: NodeKey
  ) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__alignment = resolveAlignment(alignment)
    this.__widthPercent = resolveWidthPercent(widthPercent)
  }

  static getType(): string {
    return 'image'
  }

  static clone(node: RichTextImageNode): RichTextImageNode {
    return new RichTextImageNode(
      node.__src,
      node.__altText,
      node.__alignment,
      node.__widthPercent,
      node.__key
    )
  }

  static importDOM(): null {
    return null
  }

  static importJSON(
    serializedNode: SerializedRichTextImageNode
  ): RichTextImageNode {
    return new RichTextImageNode(
      typeof serializedNode.src === 'string' ? serializedNode.src : '',
      typeof serializedNode.altText === 'string' ? serializedNode.altText : '',
      serializedNode.alignment,
      serializedNode.widthPercent
    )
  }

  exportJSON(): SerializedRichTextImageNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
      alignment: this.__alignment,
      widthPercent: this.__widthPercent,
    }
  }

  isInline(): boolean {
    return false
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    return document.createElement('div')
  }

  updateDOM(): boolean {
    return false
  }

  decorate(): null {
    return null
  }

  exportDOM(_editor: LexicalEditor): DOMExportOutput {
    if (!this.__src) {
      return { element: null }
    }

    const wrapper = document.createElement('div')
    wrapper.setAttribute('data-fs-rich-text-image-wrapper', '')
    wrapper.setAttribute('data-fs-rich-text-image-alignment', this.__alignment)

    const img = document.createElement('img')
    img.setAttribute('data-fs-rich-text-image', '')
    img.setAttribute(
      'src',
      withVtexResizeParams(this.__src, this.__widthPercent)
    )
    img.setAttribute('alt', this.__altText)
    img.setAttribute('loading', 'lazy')
    img.setAttribute('style', `width: ${this.__widthPercent}%`)

    wrapper.append(img)

    return { element: wrapper }
  }
}
