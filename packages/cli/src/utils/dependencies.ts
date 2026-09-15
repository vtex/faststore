import chalk from 'chalk'
import {
  NoAvailablePackageManagerError,
  UnknownAgentError,
  resolvePackageManager,
} from './commands'
import { logger } from './logger'
import { runCommandSync } from './runCommandSync'

type InstallDependenciesOptions = {
  dependencies: string[]
  cwd: string
  errorMessage: string
}

export async function installDependencies({
  dependencies,
  cwd,
  errorMessage,
}: InstallDependenciesOptions) {
  // Installing writes a lockfile: a substitute agent would leave a second,
  // conflicting one next to the project's (e.g. `yarn add` in a pnpm store
  // creates a `yarn.lock`), so only the detected agent is acceptable here.
  //
  // Resolve errors exit the process rather than reject: generate.ts still
  // walks missing features with forEach(async …), so a thrown error would
  // become an unhandled rejection and skip oclif handling. runCommandSync
  // already exits the process the same way on install failure.
  const { agent, command } = await resolvePackageManager(cwd, {
    substitute: false,
  }).catch((error: unknown) => {
    if (
      error instanceof NoAvailablePackageManagerError ||
      error instanceof UnknownAgentError
    ) {
      logger.error(`${chalk.red('error')} - ${error.message}`)
      process.exit(1)
    }

    throw error
  })
  const installCommand = agent === 'npm' ? 'install' : 'add'

  runCommandSync({
    // command is a validated package-manager invocation from resolvePackageManager
    cmd: `${command} ${installCommand} ${dependencies.join(' ')}`, // NOSONAR
    errorMessage,
    throws: 'error',
    cwd,
  })
}
