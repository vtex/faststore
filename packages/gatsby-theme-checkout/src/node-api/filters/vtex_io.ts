// TODO: fetch this via API
const dependencyMap: Record<string, Record<number, string>> = {
  'portal-ui': {
    1: '1.14.3',
  },

  'checkout-ui': {
    5: '5.25.0',
  },

  'vtex-id-ui': {
    3: '3.20.1',
  },

  'vtex.js': {
    2: '2.11.2',
  },

  'front.cart': {
    1: '1.4.2',
  },
}

export const vtexIO = (path: string, appName: string, major: number) => {
  const version = dependencyMap[appName]?.[major]

  if (version === undefined) {
    throw new Error(`Could not find version for ${appName}@${major}`)
  }

  const url = `//io.vtex.com.br/${appName}/${version}/${path}`

  return url
}
