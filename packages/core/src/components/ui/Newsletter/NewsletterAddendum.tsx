/**
 * TODO:
 *
 * This library hasn't been updated in 4 years at the time of writing.
 *
 * We're using it as a patch, and it is expected that some Rich Text use cases of draftjs are not supported by it.
 * We have the dependency on draftjs because of the way the headless CMS send us the data.
 *
 * This library should be removed as soon as possible, which will probably be possible through one of two cases:
 * 1. We support React Server Components and go back to using the official draftjs library for doing this, only on the server.
 *    This is still not the ideal solution, since it still relies on a unsupported, deprecated and archived library (draftjs).
 * 2. CMS uses a new library or changes how it sends the data to not depend on draftjs.
 *
 * This is a limitation not only for this component, but for every native & custom component that makes use of Rich Text.
 */

// @ts-ignore motivation: cannot find the draftjs-to-html package types.
import draftToHtml from 'draftjs-to-html'
import { NewsletterAddendum as UINewsletterAddendum } from '@faststore/ui'
import type { NewsletterAddendumProps as UINewsletterAddendumProps } from '@faststore/ui'

export interface NewsletterAddendumProps {
  /**
   * Expects a string of a JSON object in the form of draftjs's raw content state.
   */
  addendum: UINewsletterAddendumProps['addendum']
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

function cmsToHtml(addendum: string) {
  if (!addendum) {
    return ''
  }

  let rawDraftContentState = null

  try {
    rawDraftContentState = JSON.parse(addendum)
  } catch (e) {
    throw new Error(
      'Newsletter\'s prop "addendum" is not a JSON string. This is happening because the overridden prop is malformed or the CMS is providing malformed content for that prop.',
      {
        cause: e,
      }
    )
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

export function NewsletterAddendum({
  addendum,
  ...otherProps
}: NewsletterAddendumProps) {
  return (
    <UINewsletterAddendum
      dangerouslySetInnerHTML={{ __html: cmsToHtml(addendum) }}
      {...otherProps}
    />
  )
}
