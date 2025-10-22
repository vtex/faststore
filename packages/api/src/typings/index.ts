type Platform = 'vtex'

type PromiseType<T> = T extends Promise<infer U> ? U : T

type ArrayElementType<T> = T extends Array<infer U> ? U : T

interface APIResponse {
  status(n: number): APIResponse
  end(): APIResponse
  setHeader(key: string, value: string | Array<string>): APIResponse
  send(body?: any): void
}

type APIRequest = {
  method: string
  headers: Partial<{
    [key: string]: string | string[]
  }>
  cookies: Partial<{
    [key: string]: string
  }>
  body: any
  query: Partial<{
    [key: string]: string | string[]
  }>
}

type Context = Partial<{
  refreshToken: boolean
  token: Record<string, any>
  query: string
  operationName: string
  variables: any
  config: Record<string, any>
}> & {
  storeId: string
  graphqlRunner<V extends { [k in string]: unknown } | null, D>(
    ...p: Parameters<GraphqlRunner<V, D>>
  ): ReturnType<GraphqlRunner<V, D>>
}

type GraphqlRunner<V, Data> = (
  options: {
    operation: Partial<{
      __meta__: Partial<{
        operationName: string
        operationHash: string
      }>
    }>
    variables: V
    query?: string | null
  },
  request: APIRequest
) => Promise<{
  data: Data
  errors: unknown[]
  extensions: {
    cookies: Map<string, Record<string, string>> | null
    cacheControl?: Partial<{
      sMaxAge?: number
      staleWhileRevalidate?: number
      scope?: string
    }>
  }
}>

type APIHandler<Request extends APIRequest = APIRequest> = (
  request: Request,
  response: APIResponse,
  context: Context
) => Promise<void> | void
