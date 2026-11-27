import type { NextApiHandler } from 'next'

import storeConfig from 'discovery.config'
import { buildLlmsTxt } from 'src/server/llms'
import type { LlmsConfig } from 'src/server/llms'

const CACHE_CONTROL = 'public, s-maxage=3600, stale-while-revalidate=86400'

const handler: NextApiHandler = async (request, response) => {
  if (request.method !== 'GET') {
    response.status(405).end()
    return
  }

  const llmsConfig = (storeConfig as { llms?: LlmsConfig }).llms

  if (!llmsConfig?.enabled) {
    response.status(404).end()
    return
  }

  try {
    const body = await buildLlmsTxt({
      config: llmsConfig,
      storeUrl: storeConfig.storeUrl,
    })

    if (!body) {
      response.status(404).end()
      return
    }

    response.setHeader('Content-Type', 'text/markdown; charset=utf-8')
    response.setHeader('Cache-Control', CACHE_CONTROL)
    response.setHeader('X-Robots-Tag', 'noindex')
    response.status(200).send(body)
  } catch (error) {
    console.error('Failed to build /llms.txt', error)
    response.status(500).end()
  }
}

export default handler
