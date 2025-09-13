import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const DEFAULT_PACKAGE_MANAGER = 'yarn'

const supportedPackageManagers = {
  yarn: true,
  pnpm: true,
  bun: true,
  npm: true,
}

// Retrieves the package manager based on the developer lockfile, using `ni`.
export function getPreferredPackageManager() {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json')

  if (!existsSync(packageJsonPath)) {
    console.warn(
      `package.json not found! Using default package manager: ${DEFAULT_PACKAGE_MANAGER}.`
    )
    return DEFAULT_PACKAGE_MANAGER // TODO threat errors
  }

  const fileContent = readFileSync(packageJsonPath)
  const { packageManager } = JSON.parse(fileContent.toString())

  if (!packageManager) {
    console.warn(
      `Corepack not enabled! Using default package manager: ${DEFAULT_PACKAGE_MANAGER}.`
    )
    return DEFAULT_PACKAGE_MANAGER // corepack not enabled
  }

  const [packageManagerName] = packageManager.split('@')

  if (
    !supportedPackageManagers[
      packageManagerName as keyof typeof supportedPackageManagers
    ]
  ) {
    console.warn(
      `${packageManagerName} is not supported: Use one of ${Object.keys(supportedPackageManagers).join(',')}.`
    )
    return DEFAULT_PACKAGE_MANAGER // TODO threat errors
  }

  return packageManagerName
}
