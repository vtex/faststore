import { existsSync } from 'fs'
import chalk from 'chalk'
import { logger } from './logger'

/**
 * Checks for the presence of deprecated secret files and logs a warning if found.
 *
 * @param basePath The base path where to look for the secret files
 */
export function checkDeprecatedSecretFiles(basePath: string) {
  const secretsFilePath = `${basePath}/secrets.hidden.json`
  const vtexEnvFilePath = `${basePath}/vtex.env`

  const secretsFileExists = existsSync(secretsFilePath)
  const vtexEnvFileExists = existsSync(vtexEnvFilePath)

  if (secretsFileExists || vtexEnvFileExists) {
    const filesFound = [
      secretsFileExists ? 'secrets.hidden.json' : null,
      vtexEnvFileExists ? 'vtex.env' : null,
    ]
      .filter(Boolean)
      .join(' and ')

    logger.log(
      `${chalk.yellow('warning')} - Deprecated secret files detected: ${chalk.bold(filesFound)}\n` +
        `These files are deprecated and will be ignored in future versions.\n` +
        `Please create your secrets directly in the FastStore WebOps UI instead.`
    )
    logger.log('') // Add empty line for better readability
  }
}
