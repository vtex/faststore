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
  const { agent, command } = await resolvePackageManager()
  const installCommand = agent === 'npm' ? 'install' : 'add'

  runCommandSync({
    cmd: `${command} ${installCommand} ${dependencies.join(' ')}`,
    errorMessage,
    throws: 'error',
    cwd,
  })
}
