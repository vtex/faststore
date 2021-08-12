/**
 * Stable outputfile implementation.
 * If the file's content haven't changed, don't write anything to the disk.
 *
 * This is necessary to avoid webpack to enter in an infinite loop
 */
import { createHash } from 'crypto'

import { outputFile as fsExtraOutputFile, pathExists, readFile } from 'fs-extra'

function hash(s: string) {
  return createHash('md5').update(s, 'utf8').digest().toString('hex')
}

export const outputFile = async (file: string, data: string) => {
  const exists = await pathExists(file)

  if (exists) {
    const oldData = await readFile(file)

    if (hash(oldData.toString()) === hash(data)) {
      return
    }
  }

  return fsExtraOutputFile(file, data)
}
