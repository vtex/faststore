/* =========================================================================
 * !!!  TEMPORARY DEBUG ROUTE — DO NOT MERGE  !!!
 *
 * This route is part of the POC for vtex/faststore#3339 (CloudFront viewer-
 * location header forwarding to Intelligent Search). Its only purpose is to
 * empirically verify, in a staging environment behind the production-equivalent
 * CloudFront Origin Request Policy, that `CloudFront-Viewer-*` headers are
 * actually being injected by the CDN on requests reaching the FastStore origin.
 *
 * Once that verification is done, this file MUST be deleted before merging the
 * PR. It is gated behind FASTSTORE_DEBUG_CF_HEADERS=true so it cannot be hit
 * by accident in production, but the gate is a belt — the suspenders are
 * deleting the file.
 *
 * Owner: Gabriel Eluan + IS team (POC verification).
 * Track for removal: vtex/faststore#3339.
 * =========================================================================
 */
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.FASTSTORE_DEBUG_CF_HEADERS !== 'true') {
    return res.status(404).end()
  }

  const cloudfrontHeaders = Object.fromEntries(
    Object.entries(req.headers).filter(([name]) =>
      name.toLowerCase().startsWith('cloudfront-viewer-')
    )
  )

  res.status(200).json({
    count: Object.keys(cloudfrontHeaders).length,
    headers: cloudfrontHeaders,
  })
}
