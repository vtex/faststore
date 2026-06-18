import chalk from 'chalk'
import { existsSync } from 'node:fs'
import path from 'node:path'

import { pathToFileURL } from 'node:url'
import { withBasePath } from './directory'
import { logger } from './logger'

const configFileName = 'discovery.config.js'

export type ResolvedContentSource = 'CMS' | 'CP'

/**
 * Resolves the store's contentSource.type to a supported CMS flow.
 * Absent or CMS → legacy Headless CMS; CP → Content Platform schema publish.
 */
export function resolveContentSource(rawType?: string): ResolvedContentSource {
  const normalized = rawType?.toUpperCase()

  switch (normalized) {
    case undefined:
    case 'CMS':
      return 'CMS'
    case 'CP':
      return 'CP'
    default: {
      logger.error(
        `${chalk.red('[Error]')} - Unsupported contentSource.type "${rawType}". Expected "CMS" or "CP".`
      )
      process.exit(1)
    }
  }
}

/**
 * Partial type for discovery config with only the properties used by this module
 */
type DiscoveryConfigSubset = {
  localization?: {
    enabled?: boolean
  }
  contentSource?: {
    type?: string
  }
}

/**
 * Reads and returns the discovery config from tmpDir or basePath.
 *
 * @param basePath - The base path where the FastStore is located
 * @returns Promise<DiscoveryConfigSubset | null> - The config object or null if not found
 */
export async function getDiscoveryConfig(
  basePath: string
): Promise<DiscoveryConfigSubset | null> {
  const { tmpDir } = withBasePath(basePath)
  const configPaths = [
    path.join(tmpDir, configFileName),
    path.join(basePath, configFileName),
  ]

  for (const configPath of configPaths) {
    if (existsSync(configPath)) {
      try {
        const discoveryConfig = await import(pathToFileURL(configPath).href)
        return discoveryConfig?.default ?? discoveryConfig
      } catch (error) {
        logger.warn(
          `${chalk.yellow('warning')} - Could not read config file: ${configPath}.`
        )
      }
    }
  }

  return null
}

/**
 * Checks if localization feature is enabled in the discovery config.
 *
 * @param config - The discovery config object
 * @returns boolean - true if localization.enabled === true, false otherwise
 */
function isLocalizationEnabled(config: DiscoveryConfigSubset): boolean {
  return config?.localization?.enabled === true
}

/**
 * Validates if contentSource is set to "CP" when localization is enabled.
 * Exits the process with an error message if validation fails.
 *
 * @param config - The discovery config object
 */
function validateContentSourceForLocalization(
  config: DiscoveryConfigSubset
): void {
  if (!isLocalizationEnabled(config)) {
    return
  }

  const currentContentSourceType = config?.contentSource?.type?.toUpperCase()

  if (currentContentSourceType !== 'CP') {
    logger.error(
      `\n${chalk.red('[Error]')} - Localization is enabled but contentSource is set to "${currentContentSourceType}".\n\n` +
        `${chalk.cyan('Required Action:')}\n` +
        `Update your ${chalk.bold('discovery.config.js')} file:\n\n` +
        `  contentSource: {\n` +
        `    type: ${chalk.green('"CP"')}\n` +
        `  },\n\n` +
        `${chalk.dim('When localization is enabled, Content Platform (CP) is required.')}\n`
    )

    process.exit(1)
  }
}

/**
 * Checks localization status and validates configuration.
 * Reads the config file once and performs both checks.
 *
 * @param basePath - The base path where the FastStore is located
 * @returns Promise<boolean> - true if localization is enabled and valid, false otherwise
 */
export async function checkAndValidateLocalization(
  basePath: string
): Promise<boolean> {
  const config = await getDiscoveryConfig(basePath)

  // If we can't read the config, default to false (backward compatibility)
  if (!config) {
    return false
  }

  validateContentSourceForLocalization(config)

  return isLocalizationEnabled(config)
}
