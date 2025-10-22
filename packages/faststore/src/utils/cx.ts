// From Shoreline: https://github.com/vtex/shoreline/blob/fbbf106348cabf6284d8131893e2f4b026e2649b/packages/utils/src/cx.ts
import { constants } from './constants'

type CxArgs = Array<string | null | undefined>

/**
 * Spaces classNames properly
 * @param args: classnames to be combined
 * @returns {String} Classnames properly spaced
 * @example
 * cx('cn1', 'cn2') // returns => 'cn1 cn2'
 */
export function cx(...args: CxArgs): string {
  const classNames = args.reduce((acc, argument) => {
    if (!argument) {
      return acc ?? constants.emptyString
    }

    const trimmedArgument = argument.trim()
    const trimmedClassNames =
      `${acc}${constants.whiteSpace}${trimmedArgument}`.trim()

    return trimmedClassNames
  }, constants.emptyString)

  return classNames ?? constants.emptyString
}
