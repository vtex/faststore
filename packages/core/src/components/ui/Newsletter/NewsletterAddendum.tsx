import { RichText } from '../RichText'

export interface NewsletterAddendumProps {
  /**
   * Addendum content. Can be:
   * - A string of a JSON object in the form of draftjs's raw content state (for hCMS)
   * - Lexical's serialized editor state (for Content Platform)
   * - Plain HTML string
   * - Plain text
   */
  addendum: string
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
  /**
   * Additional props to pass to the RichText component
   */
  [key: string]: any
}

export function NewsletterAddendum({
  addendum,
  testId = 'fs-newsletter-addendum',
  ...otherProps
}: Readonly<NewsletterAddendumProps>) {
  if (!addendum) {
    return null
  }

  return (
    <RichText
      as="span"
      content={addendum}
      testId={testId}
      data-fs-newsletter-addendum
      {...otherProps}
    />
  )
}
