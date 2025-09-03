/**
 * This component supports both DraftJS and Lexical content formats:
 * - For hCMS content source: Uses DraftJS (legacy, will be deprecated)
 * - For Content Platform (CP): Uses Lexical (actively maintained)
 *
 * The draftjs-to-html library (used for CMS) hasn't been updated in 4 years and should be removed
 * when CMS content is fully migrated to Content Platform or a different approach.
 *
 * This is a reusable component that can be used by any component that needs to render rich text content.
 */

// @ts-ignore motivation: cannot find the draftjs-to-html package types.
import draftToHtml from 'draftjs-to-html'
import { $generateHtmlFromNodes } from '@lexical/html'
import { createHeadlessEditor } from '@lexical/headless'
import { LinkNode } from '@lexical/link'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { CodeNode } from '@lexical/code'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import {
  ParagraphNode,
  TextNode,
  RootNode,
  type SerializedEditorState,
} from 'lexical'
import { RichText as UIRichText } from '@faststore/ui'
import { isContentPlatformSource } from 'src/server/content/utils'

export interface RichTextProps {
  /**
   * Content to render. Can be:
   * - A string of a JSON object in the form of draftjs's raw content state (for hCMS)
   * - Lexical's serialized editor state (for Content Platform)
   * - Plain HTML string
   * - Plain text
   */
  content: string
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Additional props to pass to the underlying RichText component
   */
  [key: string]: any
}

function getLinkElementAsString(url: string, text: string) {
  return `
    <a
      data-fs-link="true"
      data-fs-link-variant="inline"
      data-fs-link-inverse="true"
      data-fs-link-size="regular"
      data-testid="fs-link"
      href="${url}"
    >${text}</a>`
}

function replaceLinkElements(html: string): string {
  return html.replace(
    /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g,
    (match, url, text) => getLinkElementAsString(url, text)
  )
}

function replaceLists(html: string): string {
  return html
    .replace(
      /<ol([^>]*)>/g,
      '<ol$1 data-fs-rich-text-list="true" data-fs-list-type="ordered">'
    )
    .replace(
      /<ul([^>]*)>/g,
      '<ul$1 data-fs-rich-text-list="true" data-fs-list-type="unordered">'
    )
}

function fixNestedListStructure(html: string): string {
  let result = html

  // Remove completely empty list items
  result = result.replace(/<li[^>]*>\s*<\/li>/g, '')

  // Fix empty <li> elements that directly contain nested lists
  result = result.replace(/<li([^>]*)>\s*(<(?:ul|ol)[^>]*>)/g, '$2')

  // Fix closing tags: </ul></li> should become </ul>
  result = result.replace(/(<\/(?:ul|ol)>)\s*<\/li>/g, '$1')

  // Clean up remaining structural issues
  result = result.replace(/\s*<li[^>]*>\s*(?=<(?:ul|ol))/g, '')

  return result
}

function lexicalToHtml(content: string) {
  let lexicalState: SerializedEditorState | null = null

  try {
    lexicalState = JSON.parse(content)
  } catch (e) {
    const error = new Error(
      'RichText\'s prop "content" is not a valid JSON string. This is happening because the content is malformed or the Content Platform is providing malformed content.'
    )
    error.cause = e
    throw error
  }

  if (!lexicalState) {
    return ''
  }

  const editor = createHeadlessEditor({
    nodes: [
      RootNode,
      ParagraphNode,
      TextNode,
      LinkNode,
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      HorizontalRuleNode,
    ],
    onError: (error) => {
      throw error
    },
  })

  let html = ''

  editor.update(() => {
    const editorState = editor.parseEditorState(lexicalState)
    editor.setEditorState(editorState)
  })

  editor.read(() => {
    html = $generateHtmlFromNodes(editor, null)
  })

  const withLinks = replaceLinkElements(html)
  const withLists = replaceLists(withLinks)
  return fixNestedListStructure(withLists)
}

function cmsToHtml(content: string) {
  let rawDraftContentState: any = null

  try {
    rawDraftContentState = JSON.parse(content)
  } catch (e) {
    const error = new Error(
      'RichText\'s prop "content" is not a valid JSON string. This is happening because the content is malformed or the CMS is providing malformed content.'
    )
    error.cause = e
    throw error
  }

  if (!rawDraftContentState) {
    return ''
  }

  return draftToHtml(
    rawDraftContentState,
    undefined,
    undefined,
    (entity: { type: string; data: { url: string } }, text: string) => {
      if (entity.type !== 'LINK') {
        return null
      }

      return getLinkElementAsString(entity.data.url, text)
    }
  )
}

function isJsonString(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

export function RichText({
  content,
  testId = 'fs-rich-text',
  ...otherProps
}: Readonly<RichTextProps>) {
  let htmlContent = content

  if (isJsonString(content)) {
    const convertToHtml = isContentPlatformSource() ? lexicalToHtml : cmsToHtml
    htmlContent = convertToHtml(content)
  }

  return <UIRichText content={htmlContent} testId={testId} {...otherProps} />
}
