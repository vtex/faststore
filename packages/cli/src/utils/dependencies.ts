import { resolvePackageManager } from './commands'
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
  const { agent, command } = await resolvePackageManager(cwd, {
    substitute: false,
  })
  const installCommand = agent === 'npm' ? 'install' : 'add'

  runCommandSync({
    cmd: `${command} ${installCommand} ${dependencies.join(' ')}`,
    errorMessage,
    throws: 'error',
    cwd,
  })
}
