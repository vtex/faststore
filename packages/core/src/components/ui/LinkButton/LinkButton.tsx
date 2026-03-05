import { useMemo } from 'react'
import { LinkButton as UILinkButton } from '@faststore/ui'
import type { LinkButtonProps } from '@faststore/ui'

import { useLink } from 'src/sdk/ui/useLink'

/**
 * Wraps @faststore/ui's LinkButton and automatically resolves internal hrefs
 * with the current locale's custom path prefix or Next.js locale segment using the useLink hook.
 */
function LinkButton({ href, ...otherProps }: LinkButtonProps) {
  const { resolveLink } = useLink()

  const isInternalLink = useMemo(
    () => typeof href === 'string' && href[0] === '/' && href[1] !== '/',
    [href]
  )

  const finalHref = useMemo(
    () => (isInternalLink ? (resolveLink(href) ?? href) : href),
    [href, isInternalLink, resolveLink]
  )

  return <UILinkButton href={finalHref} {...otherProps} />
}

export default LinkButton
export type { LinkButtonProps }
