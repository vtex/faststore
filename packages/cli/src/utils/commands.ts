import { agents, getVoltaPrefix } from '@antfu/ni'
import chalk from 'chalk'
import { spawnSync } from 'node:child_process'
import { logger } from './logger'

const DEFAULT_AGENT = 'yarn'

export function getPreferredPackageManager() {
  // No shell on POSIX: `?` is a glob there, so a single-character filename in
  // the store would rewrite the probe (e.g. `na x`). Windows still needs a
  // shell to run the `na.cmd` shim, and cmd.exe does not expand globs.
  const probe = spawnSync('na', ['?'], {
    encoding: 'utf8',
    shell: process.platform === 'win32',
  })
  const resolved = probe.stdout?.trim() ?? ''

  const voltaPrefix = getVoltaPrefix()
  const agent =
    voltaPrefix && resolved.startsWith(`${voltaPrefix} `)
      ? resolved.slice(voltaPrefix.length + 1)
      : resolved

  if (!(agents as string[]).includes(agent)) {
    if (agent !== '') {
      logger.warn(
        `${chalk.yellow(
          'warning'
        )} - Could not resolve a known package manager, "na" returned: ${agent
          .split('\n')[0]
          .slice(0, 120)}`
      )
      logger.warn(
        `${chalk.yellow(
          'warning'
        )} - Using "${DEFAULT_AGENT}" instead. If more than one lockfile is committed, keep a single one so the package manager is unambiguous.`
      )
    }

    return voltaPrefix ? `${voltaPrefix} ${DEFAULT_AGENT}` : DEFAULT_AGENT
  }

  return resolved
}
