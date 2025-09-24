import { forwardRef } from 'react'
import type { HTMLAttributes, DetailedHTMLProps, ElementType } from 'react'

export interface RichTextProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  /**
   * The HTML content to render
   */
  content: string
  /**
   * The HTML element to render as (default: 'div')
   */
  as?: ElementType
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const RichText = forwardRef<HTMLElement, RichTextProps>(function RichText(
  { content, as: Component = 'div', testId = 'fs-rich-text', ...otherProps },
  ref
) {
  return (
    <Component
      ref={ref}
      data-testid={testId}
      data-fs-rich-text
      dangerouslySetInnerHTML={{ __html: content }}
      {...otherProps}
    />
  )
})

export default RichText
