import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { typeDefs } from './dist'
import watch from 'glob-watcher'

const logTime = (str: string) =>
  console.log(`${new Date().toISOString()} - ${str}`)

const isWatch = ([argOne = '', valArgOne = '']: Array<string | undefined>) =>
  ['--watch', '-w', 'watch'].includes(argOne) &&
  !['false', '0'].includes(valArgOne)

function run(cb?: Function) {
  const getFileName = () => process.argv[2] ?? ''
  const absoluteFileName = resolve(process.cwd(), getFileName())
  const absFileDirName = dirname(absoluteFileName)

  if (!existsSync(absFileDirName))
    mkdirSync(absFileDirName, { recursive: true })
  else if (existsSync(absoluteFileName)) {
    unlinkSync(absoluteFileName)
  }

  writeFileSync(absoluteFileName, typeDefs)

  cb?.()
}

console.clear()
run()

if (
  isWatch((process.argv[3] ?? '').split(' ')) ||
  isWatch((process.argv[3] ?? '').split('='))
) {
  const globPattern = resolve(__filename, '../..', './**/*.graphql')
  logTime(`Watching to graphql schema changes: ${globPattern}`)
  const watcher = watch([globPattern], {
    events: ['change'],
  })
  watcher.on('change', (path) => {
    console.clear()
    logTime(`File changed\n.   --> ${path}`)
    run()
  })
}
