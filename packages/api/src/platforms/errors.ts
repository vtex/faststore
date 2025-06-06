type ErrorType =
  | 'BadRequestError'
  | 'NotFoundError'
  | 'RedirectError'
  | 'ForbiddenError'

interface Extension {
  type: ErrorType
  status: number
}

class FastStoreError<T extends Extension = Extension> extends Error {
  constructor(
    public extensions: T,
    message?: string
  ) {
    super(message)
    this.name = 'FastStoreError'
  }
}

export class BadRequestError extends FastStoreError {
  constructor(message?: string) {
    super({ status: 400, type: 'BadRequestError' }, message)
  }
}

export class NotFoundError extends FastStoreError {
  constructor(message?: string) {
    super({ status: 404, type: 'NotFoundError' }, message)
  }
}

export class ForbiddenError extends FastStoreError {
  constructor(message?: string) {
    super({ status: 403, type: 'ForbiddenError' }, message)
  }
}

export const isFastStoreError = (error: any): error is FastStoreError =>
  error?.name === 'FastStoreError'

export const isNotFoundError = (error: any): error is NotFoundError =>
  error?.extensions?.type === 'NotFoundError'

export const isBadRequestError = (error: any): error is BadRequestError =>
  error?.extensions?.type === 'BadRequestError'

export const isForbiddenError = (error: any): error is ForbiddenError =>
  error?.extensions?.type === 'ForbiddenError'
