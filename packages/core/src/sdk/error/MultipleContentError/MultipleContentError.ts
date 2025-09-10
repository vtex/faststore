import type { EntryPathParams } from '@vtex/client-cp'
import { contentSource } from '../../../../discovery.config'
import type { Options } from '../../../server/cms'

export default class MultipleContentError extends Error {
  constructor(params: Options | EntryPathParams) {
    super(
      `Multiple content defined on the ${contentSource.type} for content type ${
        params.contentType
      }. Remove duplicated content before proceeding. Context: ${JSON.stringify(
        params,
        null,
        2
      )}`
    )
  }
}
