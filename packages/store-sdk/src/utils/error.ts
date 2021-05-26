export class SDKError extends Error {
  constructor(message: string) {
    super(`[store-sdk]: ${message}`)
  }
}
