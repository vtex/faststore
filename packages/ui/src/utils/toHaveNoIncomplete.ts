import type { AxeResults } from 'axe-core'
import { printReceived, matcherHint } from 'jest-matcher-utils'
import chalk from 'chalk'

// This code is based on jest-axe library.
// https://github.com/nickcolley/jest-axe
export const toHaveNoIncompletes = {
  toHaveNoIncompletes: (results: AxeResults) => {
    if (typeof results.incomplete === 'undefined') {
      throw new Error('No incompletes found in aXe results object')
    }

    const reporter = (incompletes: AxeResults['incomplete']) => {
      if (incompletes.length === 0) {
        return []
      }

      const lineBreak = '\n\n'
      const horizontalLine = '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500'

      return incompletes
        .map((incomplete) => {
          const errorBody = incomplete.nodes
            .map((node) => {
              const selector = node.target.join(', ')
              const expectedText = `Expected the HTML found at $('${selector}') to have no incompletes:${lineBreak}`

              return `${
                expectedText + chalk.grey(node.html) + lineBreak
              }Received:${lineBreak}${printReceived(
                `${incomplete.help} (${incomplete.id})`
              )}${lineBreak}${chalk.yellow(node.failureSummary)}${lineBreak}${
                incomplete.helpUrl
                  ? `You can find more information on this issue here: \n${chalk.blue(
                      incomplete.helpUrl
                    )}`
                  : ''
              }`
            })
            .join(lineBreak)

          return errorBody
        })
        .join(lineBreak + horizontalLine + lineBreak)
    }

    const { incomplete: incompletes } = results
    const formatedIncompletes = reporter(incompletes)
    const pass = formatedIncompletes.length === 0

    const message = () => {
      if (pass) {
        return ''
      }

      return (
        `${matcherHint('.toHaveNoIncompletes')}\n\n` + `${formatedIncompletes}`
      )
    }

    return { actual: incompletes, message, pass }
  },
}
