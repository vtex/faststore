#! /usr/bin/env node

import { rmSync, mkdirSync, readdirSync, symlinkSync } from 'node:fs'
import { join } from 'node:path'

const FILEPATH = import.meta.dirname
const DRY_RUN = process.env.DRY_RUN ?? false
// const DRY_RUN = true

const exec = (fn) => {
  return (...args) => {
    console.log(`%s: %O`, fn.name, args)

    if (DRY_RUN) return
    return fn(...args)
  }
}

const RM = exec(rmSync)
const MKDIR = exec(mkdirSync)
const LINK = exec(symlinkSync)

function main() {
  RM(`${FILEPATH}/../CLAUDE.md`, { force: true })

  for (const folder of readdirSync(join(FILEPATH, '../.agents'), {
    withFileTypes: true,
  })) {
    const folders = ['skills', 'commands', 'rules']
    const folderName = folder.name
    if (folders.includes(folderName) === false) continue

    MKDIR(join(FILEPATH, `../.claude/${folderName}`), { recursive: true })

    for (const target of readdirSync(
      join(FILEPATH, `../.agents/${folderName}`)
    )) {
      RM(`${FILEPATH}/../.claude/${folderName}/${target}`, { force: true })
      LINK(
        join(FILEPATH, `../.agents/${folderName}/${target}`),
        join(FILEPATH, `../.claude/${folderName}/${target}`)
      )
    }
  }

  LINK(join(FILEPATH, '../AGENTS.md'), join(FILEPATH, '../CLAUDE.md'))
}

main()
