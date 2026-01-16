import { existsSync } from 'fs'
import path from 'path'
import chalk from 'chalk'

import { logger } from './logger'
import { withBasePath } from './directory'

const configFileName = 'discovery.config.js'

/**
 * Checks if localization feature is enabled in the discovery config.
 * Reads from discovery.config.default.js file in tmpDir or basePath.
 *
 * @param basePath - The base path where the FastStore is located
 * @returns Promise<boolean> - true if localization.enabled === true, false otherwise
 */
export async function isLocalizationEnabled(
  basePath: string
): Promise<boolean> {
  const { tmpDir } = withBasePath(basePath)
  const configPaths = [
    path.join(tmpDir, configFileName),
    path.join(basePath, configFileName),
  ]

  for (const configPath of configPaths) {
    if (existsSync(configPath)) {
      try {
        const discoveryConfig = await import(configPath)
        const config = discoveryConfig?.default ?? discoveryConfig
        return config?.localization?.enabled === true
      } catch (error) {
        // If we can't read the config, default to false (backward compatibility)
        logger.warn(
          `${chalk.yellow('warning')} - Could not read config file: ${configPath}. Defaulting Localization to disabled.`
        )
      }
    }
  }

  return false
}
