import type { NewsletterAddendumProps as UINewsletterAddendumProps } from '@faststore/ui'
import { NewsletterAddendum as UINewsletterAddendum } from '@faststore/ui'

export interface NewsletterAddendumProps {
  /**
   * Expects a string of a JSON object in the form of draftjs's raw content state.
   */
  addendum: UINewsletterAddendumProps['addendum']
}

export function NewsletterAddendum({
  addendum,
  ...otherProps
}: NewsletterAddendumProps) {
  const addendumParsed = JSON.parse(addendum as string) ?? ''
  return (
    <UINewsletterAddendum
      dangerouslySetInnerHTML={{ __html: addendumParsed?.blocks?.[0].text }}
      {...otherProps}
    />
  )
}
