import chalk from 'chalk'
import type { ChildProcess, ExecException } from 'child_process'
import { execSync } from 'child_process'
import { logger } from './logger'

type ExecSyncError = (ExecException & ChildProcess) | undefined

const showError = ({
  message,
  cmd,
  error,
}: {
  message: string
  cmd: string
  error: ExecSyncError
}) => {
  logger.error(`${chalk.red('error')} - ${message}`)

  if (cmd && error) {
    logger.log(`${chalk.magenta('DEBUG')} - $ ${cmd} error root ↓`)
    logger.log(error.stdout?.toString())
  }

  process.exit(1)
}

const showWarning = ({
  message,
  cmd,
  error,
}: {
  message: string
  cmd: string
  error: ExecSyncError
}) => {
  logger.warn(`${chalk.yellow('warn')} - ${message}`)

  if (cmd && error) {
    logger.log(`${chalk.magenta('DEBUG')} - $ ${cmd} warn root ↓`)
    logger.log(error.stdout?.toString())
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
  const debug = process.env.DISCOVERY_DEBUG === 'true' ? true : false

  try {
    logger.log(`[STARTED] ${cmd}`)

    const res = execSync(
      debug ? `${cmd} --debug --verbose 2>&1` : `${cmd} 2>&1`,
      {
        stdio: 'pipe',
        cwd,
      }
    )
    logger.log(`[STATUS] ${res.toString()}`)
    logger.log(`[FINISHED] ${cmd}`)
  } catch (error) {
    const sanitizedError = debug ? (error as ExecSyncError) : undefined

    if (throws === 'warning') {
      showWarning({ message: errorMessage, cmd, error: sanitizedError })
    } else {
      showError({ message: errorMessage, cmd, error: sanitizedError })
    }
  }
}
