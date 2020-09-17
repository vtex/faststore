import { PageProps, Actions } from 'gatsby'

declare global {
  type Manifest = Record<string, string[]>

  type Redirect = Actions['createRedirect'] extends (redirect: infer R) => any
    ? R
    : never

  type Page = PageProps['pageResources']['page']

  interface Header {
    name: string
    value: string
  }

  interface PathHeadersMap {
    [path: string]: Header[]
  }
}
