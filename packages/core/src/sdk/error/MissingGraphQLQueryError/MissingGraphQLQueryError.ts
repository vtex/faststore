export default class MissingGraphQLQueryError extends Error {
  constructor(operationName?: string, operationHash?: string) {
    super(
      `No query found for operationName ${operationName ?? 'undefined'} and operationHash ${operationHash ?? 'undefined'}.`
    )
    this.name = 'MissingGraphQLQueryError'
  }
}
