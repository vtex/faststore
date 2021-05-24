import {
  readFile as readFileFS,
  writeFile as writeFileFS,
  rename as renameFS,
} from 'fs'
import { join } from 'path'
import { promisify } from 'util'

const root = process.cwd()

const readFile = promisify(readFileFS)
const writeFile = promisify(writeFileFS)
const renameFile = promisify(renameFS)

const cacheDirPath = (file: string) => join(root, '.cache', file)

export const getPageDataJsonPath = (path: string) =>
  join('/page-data', path, '/page-data.json')

export const copyToCacheDir = async (fromFile: string) => {
  const fromPath = require.resolve(join('../cache-dir', fromFile), {
    paths: [__dirname],
  })

  const toPath = cacheDirPath(fromFile)

  const data = await readFile(fromPath, { encoding: 'utf-8' })

  await writeFile(toPath, data)
}

export const renameFileCacheDir = async (fromFile: string, toFile: string) => {
  const fromPath = cacheDirPath(fromFile)
  const toPath = cacheDirPath(toFile)

  await renameFile(fromPath, toPath)
}

export const wrapApiRunnerBrowserPlugins = async () => {
  const file = cacheDirPath('api-runner-browser-plugins.js')
  const buffer = await readFile(file)

  const plugins = buffer
    .toString()
    .replace(/plugin: require/g, 'plugins: () => require')

  await writeFile(file, plugins)
}
