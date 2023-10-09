import sanitizeHtmlLib from 'sanitize-html'

/**
 * For now, we're using sanitize-html's default set
 * of allowed tags and attributes, which don't even include img elements
 *
 * It is known many client depends on pontentially vulnerable tags, such as script tags
 * We chose to be restrictive at first, and document those restrictions later.
 *
 * When expanding the set of allowed tags and attributes, please consider performance, privacy and security.
 *
 * This possibily breaks compatibility with Portal and Store Framework,
 * which both allows an enormous amount of tags and attributes
 *
 * This was a thoughtful decision that can be reviewed in the future given
 * research was made to back up those changes.
 */
export const sanitizeHtml = (
  dirty: Parameters<typeof sanitizeHtmlLib>[0],
  options?: Parameters<typeof sanitizeHtmlLib>[1]
) => sanitizeHtmlLib(dirty, options)
