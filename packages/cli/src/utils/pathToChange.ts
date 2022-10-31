
import { resolve as resolvePath, sep } from 'path'
import { Readable } from 'stream'
import { readFileSync } from 'fs-extra'
import { getRoot } from './directory'

export interface ChangeToCopy {
  path: string | null
  content: string | Readable | Buffer | NodeJS.ReadableStream
}

const pathToChange = (path: string, remove?: boolean): ChangeToCopy => {
  const content = remove
    ? ''
    : readFileSync(resolvePath(getRoot(), path)).toString('base64')

  return {
    content,
    path: path.split(sep).join('/'),
  }
}

export { pathToChange }