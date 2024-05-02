import { Options } from 'src/server/cms'

export default class MissingContentError extends Error {
  constructor(options: Options) {
    super(
      `Missing content on the CMS for content type ${
        options.contentType
      }. Add content before proceeding. Context: ${JSON.stringify(
        options,
        null,
        2
      )}`
    )
  }
}
