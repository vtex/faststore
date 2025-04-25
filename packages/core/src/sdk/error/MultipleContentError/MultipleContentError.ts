import type { Options } from 'src/server/cms'
import type { EntryPathParams } from '@vtex/client-cp'

export default class MultipleContentError extends Error {
  constructor(params: Options | EntryPathParams, origin = 'CMS') {
    super(
      `Multiple content defined on the ${origin} for content type ${
        params.contentType
      }. Remove duplicated content before proceeding. Context: ${JSON.stringify(
        params,
        null,
        2
      )}`
    )
  }
}
