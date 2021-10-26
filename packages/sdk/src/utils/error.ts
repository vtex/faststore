export class SDKError extends Error {
  constructor(message: string) {
    super(`[sdk]: ${message}`)
  }
}
