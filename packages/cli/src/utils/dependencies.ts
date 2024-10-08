import chalk from "chalk"
import { getPreferredPackageManager } from "./commands"
import { runCommandSync } from "./runCommandSync"

type InstallDependenciesOptions = { 
    dependencies: string[]
    cwd: string,
    errorMessage: string,
    successMessage: string,
}

const installCommandByPackageManager: Record<string, string> = { 
  yarn: 'add',
  npm: 'install',
  pnpm: 'add'
}

export function installDependencies(
 { dependencies,
  cwd, errorMessage, successMessage }: InstallDependenciesOptions
) {

  const packageManager = getPreferredPackageManager() 
  const installCommand = installCommandByPackageManager[packageManager]

  runCommandSync({
    cwd,
    cmd: `${packageManager} ${installCommand} ${dependencies.join(' ')}`,
    errorMessage,
    debug: false,
    throws: 'error'
  })

  console.log(`${chalk.green('success')} - ${successMessage}`)
}