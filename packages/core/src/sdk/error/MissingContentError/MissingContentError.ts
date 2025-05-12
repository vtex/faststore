import type { Options } from 'src/server/cms'
import type { EntryPathParams } from '@vtex/client-cp'
import { contentSource } from 'discovery.config.default'

export default class MissingContentError extends Error {
  constructor(params: Options | EntryPathParams) {
    super(
      `Missing content on the ${contentSource.type} for content type ${
        params.contentType
      }. Add content before proceeding. Context: ${JSON.stringify(
        params,
        null,
        2
      )}`
    )
  }
}
