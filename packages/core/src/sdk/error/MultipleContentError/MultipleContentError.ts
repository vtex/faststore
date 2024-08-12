import { Options } from 'app/server/cms'

export default class MultipleContentError extends Error {
  constructor(options: Options) {
    super(
      `Multiple content defined on the CMS for content type ${
        options.contentType
      }. Remove duplicated content before proceeding. Context: ${JSON.stringify(
        options,
        null,
        2
      )}`
    )
  }
}
