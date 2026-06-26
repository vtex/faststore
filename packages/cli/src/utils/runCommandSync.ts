import chalk from 'chalk'
import type { ChildProcess, ExecException } from 'node:child_process'
import { execSync } from 'node:child_process'
import { logger } from './logger'

type ExecSyncError = (ExecException & ChildProcess) | undefined

const showError = ({
  message,
  cmd,
  output,
}: {
  message: string
  cmd: string
  output?: string
}) => {
  logger.error(`${chalk.red('error')} - ${message}`)

  if (cmd && output) {
    logger.error(`${chalk.magenta('$')} ${cmd}`)
    logger.error(output)
  }

  process.exit(1)
}

const showWarning = ({
  message,
  cmd,
  output,
}: {
  message: string
  cmd: string
  output?: string
}) => {
  logger.warn(`${chalk.yellow('warn')} - ${message}`)

  if (cmd && output) {
    logger.warn(`${chalk.magenta('$')} ${cmd}`)
    logger.warn(output)
  }
}

export const runCommandSync = ({
  cmd,
  errorMessage,
  throws,
  cwd,
}: {
  cmd: string
  errorMessage: string
  throws: 'warning' | 'error'
  cwd?: string
}) => {
  try {
    logger.log(`[STARTED] ${cmd}`)

    // stdout + stderr are merged via 2>&1 so the captured output holds the
    // tool's real error. We intentionally do not append --debug/--verbose:
    // strict toolbelt commands (e.g. `vtex content generate-schema`) reject
    // unknown flags. Verbose progress logging is gated by DISCOVERY_DEBUG in
    // the logger itself.
    const res = execSync(`${cmd} 2>&1`, {
      stdio: 'pipe',
      cwd,
    })
    logger.log(`[STATUS] ${res?.toString() ?? 'Unknown'}`)
    logger.log(`[FINISHED] ${cmd}`)
  } catch (error) {
    const execError = error as ExecSyncError
    // Always surface the tool's own output (stdout+stderr are merged via 2>&1)
    // so store devs see the real root cause instead of only the generic message.
    const output =
      execError?.stdout?.toString() ||
      execError?.stderr?.toString() ||
      undefined

    if (throws === 'warning') {
      showWarning({ message: errorMessage, cmd, output })
    } else {
      showError({ message: errorMessage, cmd, output })
    }
  }
}
