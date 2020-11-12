import { parse } from '@babel/parser'
import { Visitor } from '@babel/traverse'
import BabelTypes from '@babel/types'

interface Babel {
  types: typeof BabelTypes
}

interface Options {
  inFile: string
  inPath: string
}

// Creates getTheme function so theme-ui does not try to deep merge the theme in here
// https://github.com/system-ui/theme-ui/blob/bfba2df8fdd01119c3af6a233355db1955c54ba0/packages/core/src/index.js#L87
const template = (serialized: string) => `
function getTheme () { return JSON.parse(${serialized}); };
export default getTheme;
`

const plugin = (_: Babel, options: Options) => {
  const { inFile, inPath } = options

  const { theme } = global as any

  const visitor: Visitor = {
    Program: (path, state: any) => {
      const {
        file: {
          opts: { filename },
        },
      } = state

      if (filename === inFile) {
        // Stringify twice to make sure the strings are correctly scaped. For more info:
        // https://stackoverflow.com/questions/5506000/json-stringify-doesnt-escape
        const serialized = JSON.stringify(JSON.stringify(theme))
        const parsed = parse(template(serialized), {
          sourceType: 'module',
        })

        path.replaceWith(parsed.program)
        path.skip()
      } else if (filename.startsWith(inPath)) {
        path.remove()
        path.skip()
      }
    },
  }

  return { visitor }
}

export default plugin
