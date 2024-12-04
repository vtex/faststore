const database: Record<string, string> = {
  '/produto/7428352752/test-1': '/produto-handmade-plastic-chips-9009169/p',
  '/produto/7428352752/test-2': '/ergonomic-granite-mouse-57815628/p',
  '/busca/apple': '/s?q=apple',
}

type GetRedirectProps = {
  pathname: string
}

export function getRedirect({ pathname }: GetRedirectProps) {
  return database[pathname]
}
