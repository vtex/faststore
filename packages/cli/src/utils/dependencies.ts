import { getPreferredPackageManager } from "./commands"
import { runCommandSync } from "./runCommandSync"

type InstallDependenciesOptions = { 
    dependencies: string[]
    cwd: string,
    errorMessage: string,
}

export function installDependencies(
 { 
  dependencies,
  cwd, 
  errorMessage 
}: InstallDependenciesOptions
) {
  const packageManager = getPreferredPackageManager() 
  const installCommand = packageManager === 'npm' ? 'install' : 'add'

  runCommandSync({
    cmd: `${packageManager} ${installCommand} ${dependencies.join(' ')}`,
    errorMessage,
    throws: 'error',
    debug: false,
    cwd,
  })
}