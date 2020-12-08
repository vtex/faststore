/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import { dirname } from 'path'

import type { Visitor } from '@babel/traverse'
import type { MessageFormatElement } from 'intl-messageformat-parser'
import { parse } from '@babel/parser'
import { parse as intlParse } from 'intl-messageformat-parser'

interface Options {
  inPath: string
}

require('@babel/register')({
  extensions: ['.ts'],
  presets: ['@babel/preset-typescript'],
})

const template = (serialized: string) => `
function getMessages () {
  return JSON.parse(${serialized})
}

export default getMessages
`

const plugin = (_: any, options: Options) => {
  const { inPath } = options

  const visitor: Visitor = {
    Program: (path, state: any) => {
      const {
        file: {
          opts: { filename },
        },
      } = state

      const filepath = dirname(filename)

      // Only compile files inside the `i18n` folder
      if (filepath !== inPath) {
        return
      }

      // Run code so all merge happens in compile time
      const { default: messages } = require(filename) as {
        default: Record<string, string>
      }

      // Creates ASTs so we don't need to include the ICU parser at runtime
      const asts = Object.entries(messages).reduce((acc, [key, value]) => {
        acc[key] = intlParse(value)

        return acc
      }, {} as Record<string, MessageFormatElement[]>)

      // Serializes the JSON so we can optimize parse/compile times
      const serialized = JSON.stringify(JSON.stringify(asts))

      // Replace file with optimized template
      const parsed = parse(template(serialized), {
        sourceType: 'module',
      })

      path.replaceWith(parsed.program)
      path.skip()
    },
  }

  return { visitor }
}

export default plugin
