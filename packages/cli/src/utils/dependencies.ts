import chalk from "chalk"
import { getPreferredPackageManager } from "./commands"
import { execSync } from "node:child_process"

type InstallDependenciesOptions = { 
    dependencies: string[]
    cwd: string,
    errorMessage: string,
    successMessage: string,
}

export function installDependencies(
 { dependencies,
  cwd, successMessage }: InstallDependenciesOptions
) {

  const packageManager = getPreferredPackageManager() 
  const installCommand = packageManager === 'npm' ? 'install' : 'add'
  execSync(`${packageManager} ${installCommand} ${dependencies.join(' ')}`, {
    cwd,
  })

  console.log(`${chalk.green('success')} - ${successMessage}`)
}