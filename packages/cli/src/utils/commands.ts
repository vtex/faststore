import { agents, getVoltaPrefix } from '@antfu/ni'
import chalk from 'chalk'
import { spawnSync } from 'node:child_process'
import { logger } from './logger'

const DEFAULT_AGENT = 'yarn'

// Retrieves the package manager based on the developer lockfile, using `ni`.
export function getPreferredPackageManager() {
  const resolved = spawnSync('na', ['?'], {
    encoding: 'utf8',
    shell: true,
  }).stdout.trim()

  // `na` prefixes its output with "volta run" when Volta is installed, so the
  // agent has to be read from behind that prefix.
  const voltaPrefix = getVoltaPrefix()
  const agent =
    voltaPrefix && resolved.startsWith(`${voltaPrefix} `)
      ? resolved.slice(voltaPrefix.length + 1)
      : resolved

  // `ni` writes an interactive prompt to stdout when the detected package manager
  // is not installed, and this value is interpolated into shell commands. Only a
  // known agent may reach a shell, so anything else falls back to the default.
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
