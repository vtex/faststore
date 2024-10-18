import chalk from 'chalk'
import {
  copyFileSync,
  copySync,
  existsSync,
  mkdirsSync,
  readFileSync,
  readdirSync,
  removeSync,
  writeFileSync,
  writeJsonSync,
} from 'fs-extra'
import path from 'path'

import ora from 'ora'

import { withBasePath } from './directory'
import { installDependencies } from './dependencies'
import { logger } from './logger'

interface GenerateOptions {
  setup?: boolean
  basePath: string
}

// package.json is copied manually after filtering its content
const ignorePaths = ['package.json', 'node_modules', 'cypress.config.ts']

function createTmpFolder(basePath: string) {
  const { tmpDir, tmpFolderName } = withBasePath(basePath)

  try {
    if (existsSync(tmpDir)) {
      removeSync(tmpDir)
    }

    mkdirsSync(tmpDir)
    logger.log(
      `${chalk.green('success')} - Temporary folder ${chalk.dim(
        tmpFolderName
      )} created`
    )
  } catch (err) {
    logger.error(`${chalk.red('error')} - ${err}`)
  }
}

/**
 * Prevents imports from @faststore/core from randomly conflicting
 * where sometimes the package.json from the .faststore folder
 * took precedence over @faststore/core's package.json.
 */
function filterAndCopyPackageJson(basePath: string) {
  const { coreDir, tmpDir } = withBasePath(basePath)

  const corePackageJsonPath = path.join(coreDir, 'package.json')

  const corePackageJsonFile = readFileSync(corePackageJsonPath, 'utf8')
  let { exports: _, ...filteredFileContent } = JSON.parse(corePackageJsonFile)

  filteredFileContent.name = 'dot-faststore'

  writeJsonSync(path.join(tmpDir, 'package.json'), filteredFileContent, {
    spaces: 2,
  })
}

// Temporary array of strict rules enabled so far.
const TS_CONFIG_STRICT_RULES_ENABLED = ['noImplicitAny'] as const

/**
 * Modify TypeScript compilation settings (tsconfig.json) to disable specific strict
 * type checking rules when files are moved to the .faststore folder.
 * TODO: The idea is to change the strict to false when all strict rules are migrated.
 */
function disableTsConfigStrictRules(basePath: string) {
  const { coreDir, tmpDir } = withBasePath(basePath)

  const coreTsConfigPath = path.join(coreDir, 'tsconfig.json')

  const coreTsConfigFile = readFileSync(coreTsConfigPath, 'utf8')
  const tsConfig = JSON.parse(coreTsConfigFile)

  TS_CONFIG_STRICT_RULES_ENABLED.forEach((strictRule) => {
    tsConfig.compilerOptions[strictRule] = false
  })

  writeJsonSync(path.join(tmpDir, 'tsconfig.json'), tsConfig, {
    spaces: 2,
  })
}

function copyCoreFiles(basePath: string) {
  const { coreDir, tmpDir } = withBasePath(basePath)

  try {
    copySync(coreDir, tmpDir, {
      dereference: true,
      filter(src) {
        const fileOrDirName = path.basename(src)
        const shouldCopy = fileOrDirName
          ? !ignorePaths.includes(fileOrDirName)
          : true

        return shouldCopy
      },
    })

    filterAndCopyPackageJson(basePath)
    disableTsConfigStrictRules(basePath)

    logger.log(`${chalk.green('success')} - Core files copied`)
  } catch (e) {
    logger.error(e)
  }
}

function copyPublicFiles(basePath: string) {
  const { userDir, tmpDir } = withBasePath(basePath)

  const allowList = ['json', 'txt', 'xml', 'ico', 'public']
  try {
    if (existsSync(`${userDir}/public`)) {
      copySync(`${userDir}/public`, `${tmpDir}/public`, {
        dereference: true,
        overwrite: true,
        filter: (src) => {
          const allow = allowList.some((ext) => src.endsWith(ext))

          return allow
        },
      })
      logger.log(`${chalk.green('success')} - Public files copied`)
    }
  } catch (e) {
    logger.error(e)
  }
}

async function copyCypressFiles(basePath: string) {
  const { userDir, userStoreConfigFile, userLegacyStoreConfigFile, tmpDir } =
    withBasePath(basePath)

  try {
    // Cypress 9.x config file
    if (existsSync(`${userDir}/cypress.json`)) {
      copySync(`${userDir}/cypress.json`, `${tmpDir}/cypress.json`, {
        dereference: true,
      })
    }

    // Cypress 12.x config file
    if (existsSync(`${userDir}/cypress.config.ts`)) {
      copySync(`${userDir}/cypress.config.ts`, `${tmpDir}/cypress.config.ts`, {
        dereference: true,
      })
    }

    let userStoreConfig

    if (existsSync(userStoreConfigFile)) {
      userStoreConfig = await import(path.resolve(userStoreConfigFile))
    } else if (existsSync(userLegacyStoreConfigFile)) {
      userStoreConfig = await import(path.resolve(userLegacyStoreConfigFile))
    } else {
      logger.info(
        `${chalk.blue(
          'info'
        )} - No store config file was found in the root directory`
      )
    }

    // Copy custom Cypress folder and files
    if (
      existsSync(`${userDir}/cypress`) &&
      userStoreConfig?.experimental?.enableCypressExtension
    ) {
      copySync(`${userDir}/cypress`, `${tmpDir}/cypress`, {
        overwrite: true,
        dereference: true,
      })

      logger.log(`${chalk.green('success')} - Cypress test files copied`)
    }

    // Create default Cypress 12.x (or superior) support file
    if (userStoreConfig?.experimental?.cypressVersion > 9) {
      copySync(
        `${tmpDir}/cypress/support/index.js`,
        `${tmpDir}/cypress/support/e2e.js`,
        { overwrite: false }
      )
    }
  } catch (e) {
    logger.error(e)
  }
}

function copyUserStarterToCustomizations(basePath: string) {
  const {
    userSrcDir,
    tmpCustomizationsSrcDir,
    userLegacyStoreConfigFile,
    userStoreConfigFile,
    tmpStoreConfigFile,
  } = withBasePath(basePath)

  try {
    if (existsSync(userSrcDir) && readdirSync(userSrcDir).length > 0) {
      copySync(userSrcDir, tmpCustomizationsSrcDir, { dereference: true })
    }

    if (existsSync(userStoreConfigFile)) {
      copySync(userStoreConfigFile, tmpStoreConfigFile, { dereference: true })
    } else if (existsSync(userLegacyStoreConfigFile)) {
      copySync(userLegacyStoreConfigFile, tmpStoreConfigFile, {
        dereference: true,
      })
    } else {
      logger.info(
        `${chalk.blue(
          'info'
        )} - No store config file was found in the root directory`
      )
    }

    logger.log(`${chalk.green('success')} - Starter files copied`)
  } catch (err) {
    logger.error(`${chalk.red('error')} - ${err}`)
  }
}

async function createCmsWebhookUrlsJsonFile(basePath: string) {
  const {
    userStoreConfigFile,
    userLegacyStoreConfigFile,
    tmpCMSWebhookUrlsFile,
  } = withBasePath(basePath)
  let userStoreConfig

  if (existsSync(userStoreConfigFile)) {
    userStoreConfig = await import(path.resolve(userStoreConfigFile))
  } else if (existsSync(userLegacyStoreConfigFile)) {
    userStoreConfig = await import(path.resolve(userLegacyStoreConfigFile))
  } else {
    logger.info(
      `${chalk.blue(
        'info'
      )} - No store config file was found in the root directory`
    )
  }

  if (
    userStoreConfig?.vtexHeadlessCms &&
    userStoreConfig.vtexHeadlessCms?.webhookUrls
  ) {
    const { webhookUrls } = userStoreConfig?.vtexHeadlessCms

    try {
      writeJsonSync(tmpCMSWebhookUrlsFile, { urls: webhookUrls }, { spaces: 2 })
      logger.log(`${chalk.green('success')} - CMS webhook URLs file created`)
    } catch (err) {
      logger.error(`${chalk.red('error')} - ${err}`)
    }
  } else {
    logger.info(`${chalk.blue('info')} - No CMS webhook URLs were provided`)
  }
}

async function copyTheme(basePath: string) {
  const {
    userStoreConfigFile,
    userThemesFileDir,
    tmpThemesCustomizationsFile,
    userLegacyStoreConfigFile,
  } = withBasePath(basePath)

  let storeConfig

  if (existsSync(userStoreConfigFile)) {
    storeConfig = await import(path.resolve(userStoreConfigFile))
  } else if (existsSync(userLegacyStoreConfigFile)) {
    storeConfig = await import(path.resolve(userLegacyStoreConfigFile))
  } else {
    logger.info(
      `${chalk.blue(
        'info'
      )} - No store config file was found in the root directory`
    )
  }

  if (storeConfig.theme) {
    const customTheme = path.join(
      userThemesFileDir,
      `${storeConfig.theme}.scss`
    )
    if (existsSync(customTheme)) {
      try {
        copyFileSync(customTheme, tmpThemesCustomizationsFile)
        logger.log(
          `${chalk.green('success')} - ${
            storeConfig.theme
          } theme has been applied`
        )
      } catch (err) {
        logger.error(`${chalk.red('error')} - ${err}`)
      }
    } else {
      logger.info(
        `${chalk.blue('info')} - The ${
          storeConfig.theme
        } theme was added to the config file but the ${
          storeConfig.theme
        }.scss file does not exist in the themes folder. Read more: https://www.faststore.dev/docs/themes/overview`
      )
    }
  } else if (
    existsSync(userThemesFileDir) &&
    readdirSync(userThemesFileDir).length > 0
  ) {
    logger.info(
      `${chalk.blue(
        'info'
      )} - The theme needs to be added to the config file to be applied. Read more: https://www.faststore.dev/docs/themes/overview`
    )
  }
}

function updateBuildTime(basePath: string) {
  try {
    const { tmpSeoConfig } = withBasePath(basePath)
    let config = readFileSync(tmpSeoConfig, 'utf8')
    const newBuildTime = new Date().toISOString()

    config = config.replace(
      /const buildTime = .*?;/,
      `const buildTime = '${newBuildTime}';`
    )

    writeFileSync(tmpSeoConfig, config)

    logger.log(`${chalk.green('success')} - Build time updated`, newBuildTime)
  } catch (error) {
    logger.error(`${chalk.red('error')} - Updating build time:`, error)
  }
}

function checkDependencies(basePath: string, packagesToCheck: string[]) {
  const { coreDir, getRoot } = withBasePath(basePath)

  const corePackageJsonPath = path.join(coreDir, 'package.json')
  const rootPackageJsonPath = path.join(getRoot(), 'package.json')

  const corePackageJson = require(corePackageJsonPath)
  const rootPackageJson = require(rootPackageJsonPath)

  packagesToCheck.forEach((packageName) => {
    const coreVersion =
      corePackageJson.devDependencies[packageName] ||
      corePackageJson.dependencies[packageName]
    const rootVersion =
      rootPackageJson.devDependencies[packageName] ||
      rootPackageJson.dependencies[packageName]

    if (!coreVersion || !rootVersion) {
      logger.warn(
        `${chalk.yellow(
          'warning'
        )} - Package ${packageName} not found in both core or root dependencies.`
      )
    } else if (coreVersion !== rootVersion) {
      logger.warn(
        `${chalk.yellow(
          'warning'
        )} - Version mismatch detected for ${packageName}. 
          Core: ${coreVersion}, Customization: ${rootVersion}. Please align both versions to prevent issues`
      )
    }
  })
}

function updateNextConfig(basePath: string) {
  const { tmpDir } = withBasePath(basePath)

  const nextConfigPath = path.join(tmpDir, 'next.config.js')

  let nextConfigData = String(readFileSync(nextConfigPath))
  nextConfigData = nextConfigData.replace(
    /outputFileTracingRoot\:\s+(.*),/,
    `outputFileTracingRoot: '${process.cwd()}',`
  )

  writeFileSync(nextConfigPath, nextConfigData)
}

function validateAndInstallMissingDependencies(basePath: string) {
  const { userDir, userStoreConfigFile } = withBasePath(basePath)

  if (!existsSync(userStoreConfigFile)) {
    return
  }

  const userStoreConfig = require(userStoreConfigFile)
  const userPackageJson = require(path.join(userDir, 'package.json'))

  const missingDependencies: Array<{
    feature: string
    dependencies: string[]
  }> = []

  if (userStoreConfig.experimental.preact) {
    missingDependencies.push({
      feature: 'Preact',
      dependencies: ['preact@10.23.1', 'preact-render-to-string@6.5.8'],
    })
  }

  missingDependencies.forEach(({ feature, dependencies }) => {
    const dependenciesToInstall = dependencies.filter((dependency) => {
      const dependencyName = dependency.split('@')[0]
      return !userPackageJson.dependencies[dependencyName]
    })

    if (dependenciesToInstall.length > 0) {
      const spinner = ora(
        `Installing ${feature} missing dependencies\n`
      ).start()

      installDependencies({
        dependencies: dependenciesToInstall,
        cwd: userDir,
        errorMessage: `failed to install ${feature} dependencies`,
      })

      spinner.stop()
    }
  })
}

export async function generate(options: GenerateOptions) {
  const { basePath, setup = false } = options

  let setupPromise: Promise<unknown> | null = null

  validateAndInstallMissingDependencies(basePath)

  if (setup) {
    setupPromise = Promise.all([
      createTmpFolder(basePath),
      copyCoreFiles(basePath),
      copyCypressFiles(basePath),
      copyPublicFiles(basePath),
    ])
  }

  await Promise.all([
    setupPromise,
    checkDependencies(basePath, ['typescript']),
    updateBuildTime(basePath),
    copyUserStarterToCustomizations(basePath),
    copyTheme(basePath),
    createCmsWebhookUrlsJsonFile(basePath),
    updateNextConfig(basePath),
  ])
}
