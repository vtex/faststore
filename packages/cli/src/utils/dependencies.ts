import { spawn } from 'node:child_process'
import { getPreferredPackageManager } from './commands'

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
  const packageManager = await getPreferredPackageManager()
  const installCommand = packageManager === 'npm' ? 'install' : 'add'

  return new Promise<void>((resolve, reject) => {
    const child = spawn(packageManager, [installCommand, ...dependencies], {
      cwd,
      stdio: 'inherit',
    })

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(errorMessage))
      } else {
        resolve()
      }
    })
  })
}
