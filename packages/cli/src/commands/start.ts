import { Args, Command } from '@oclif/core'
import { spawn, spawnSync } from 'node:child_process'
import fsExtra from 'fs-extra'
import path from 'node:path'
import { resolvePackageManager } from '../utils/commands'
import { getBasePath, withBasePath } from '../utils/directory'

const { existsSync } = fsExtra

/** Validated package-manager argv only — never a shell string. */
function spawnPackageManagerSync(bin: string, args: string[]) {
  return spawnSync(bin, args, { stdio: 'inherit' }) // NOSONAR
}

function spawnPackageManager(bin: string, args: string[]) {
  return spawn(bin, args, { stdio: 'inherit' }) // NOSONAR
}

export default class Start extends Command {
  static args = {
    account: Args.string({
      description:
        'The account for which the Discovery is running. Currently noop.',
    }),
    path: Args.string({
      description:
        'The path where the FastStore being run is. Defaults to cwd.',
    }),
    port: Args.string({
      description: 'The port where FastStore should run. Defaults to 3000.',
    }),
  }

  async run() {
    const { args } = await this.parse(Start)
    const basePath = getBasePath(args.path)
    const port = args.port ?? 3000
    const { getRoot, tmpDir } = withBasePath(basePath)
    const { argv } = await resolvePackageManager(basePath)
    const [bin, ...runnerArgs] = argv

    if (!existsSync(path.join(getRoot(), '.next'))) {
      // argv is a validated package-manager binary (plus optional Volta
      // prefix), never a shell string — keep this off a shell so the original
      // FAS-1199 prompt leak cannot reach sh.
      const build = spawnPackageManagerSync(bin, [
        ...runnerArgs,
        'faststore',
        'build',
      ])

      if (build.status !== 0) {
        throw new Error(
          `"${[bin, ...runnerArgs].join(' ')} faststore build" failed, so there is no build to serve.`
        )
      }
    }

    return spawnPackageManager(bin, [
      ...runnerArgs,
      'next',
      'start',
      tmpDir,
      '-p',
      String(port),
    ])
  }
}
