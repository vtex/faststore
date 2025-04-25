import type { Options } from 'src/server/cms'
import type { EntryPathParams } from '@vtex/client-cp'

export default class MissingContentError extends Error {
  constructor(params: Options | EntryPathParams, origin = 'CMS') {
    super(
      `Missing content on the ${origin} for content type ${
        params.contentType
      }. Add content before proceeding. Context: ${JSON.stringify(
        params,
        null,
        2
      )}`
    )
  }
}
