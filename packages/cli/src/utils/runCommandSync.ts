import chalk from 'chalk'
import type { ChildProcess, ExecException } from 'child_process'
import { execSync } from 'child_process'

type ExecSyncError = (ExecException & ChildProcess) | undefined

const showError = ({
  message,
  cmd,
  error,
  debug,
}: {
  message: string
  cmd: string
  error: ExecSyncError
  debug: boolean
}) => {
  console.log(`${chalk.red('error')} - ${message}`)

  if (debug && cmd && error) {
    console.log(`${chalk.magenta('DEBUG')} - $ ${cmd} error root ↓`)
    console.log(error.stdout?.toString())
  }

  process.exit(1)
}

const showWarning = ({
  message,
  cmd,
  error,
  debug,
}: {
  message: string
  cmd: string
  error: ExecSyncError
  debug: boolean
}) => {
  console.log(`${chalk.yellow('warn')} - ${message}`)

  if (debug && cmd && error) {
    console.log(`${chalk.magenta('DEBUG')} - $ ${cmd} warn root ↓`)
    console.log(error.stdout?.toString())
  }
}

export const runCommandSync = async ({
  cmd,
  errorMessage,
  throws,
  debug,
  cwd,
}: {
  cmd: string
  errorMessage: string
  throws: 'warning' | 'error'
  debug: boolean
  cwd?: string
}) => {
  try {
    if (debug) {
      console.log(`[STARTED] ${cmd}`)
    }

    const res = execSync(
      debug ? `${cmd} --debug --verbose 2>&1` : `${cmd} 2>&1`,
      {
        stdio: 'pipe',
        cwd,
      }
    )
    if (debug) {
      console.log(`[STATUS] ${res.toString()}`)
      console.log(`[FINISHED] ${cmd}`)
    }
  } catch (error) {
    const sanitizedError = debug ? (error as ExecSyncError) : undefined

    if (throws === 'warning') {
      showWarning({ message: errorMessage, cmd, error: sanitizedError, debug })
    } else {
      showError({ message: errorMessage, cmd, error: sanitizedError, debug })
    }
  }
}
