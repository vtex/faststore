import { readFile as readFileFS, writeFile as writeFileFS } from 'fs'
import { join, basename } from 'path'
import { promisify } from 'util'

const root = process.cwd()

const readFile = promisify(readFileFS)
const writeFile = promisify(writeFileFS)

export const getPageDataJsonPath = (path: string) =>
  join('/page-data', path, '/page-data.json')

export const copyToCacheDir = async (fromPath: string) => {
  const toPath = join(root, '.cache', basename(fromPath))

  const data = await readFile(fromPath, { encoding: 'utf-8' })

  await writeFile(toPath, data)
}
