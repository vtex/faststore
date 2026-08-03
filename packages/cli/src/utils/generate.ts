import chalk from 'chalk'
import fsExtra from 'fs-extra'

import path from 'node:path'

import ora from 'ora'

import { pathToFileURL } from 'node:url'
import { createNextJsPages } from './createNextjsPages'
import { installDependencies } from './dependencies'
import { withBasePath } from './directory'
import { logger } from './logger'
import { installPlugins } from './plugins'

const {
  copyFileSync,
  copySync,
  existsSync,
  mkdirsSync,
  readFileSync,
  readdirSync,
  removeSync,
  statSync,
  writeFileSync,
  writeJsonSync,
} = fsExtra
interface GenerateOptions {
  setup?: boolean
  basePath: string
}

// package.json is copied manually after filtering its content
const ignorePaths = [
  'package.json',
  'node_modules',
  'cypress.config.ts',
  'base.jsonc', // CP special file, it must not be copied to the merchants' temp dir
]

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
 * Builds the `.faststore/package.json` from `@faststore/core`'s manifest.
 * Strips `exports` and `packageManager` (the latter is pinned to pnpm and
 * breaks Yarn/Corepack on consumer stores).
 *
 * Propagates the store's `volta` config (when present) so Volta pins the same
 * Node/Yarn versions inside `.faststore`. Volta stops at the nearest
 * `package.json` and would otherwise fall back to a global Yarn Berry, which
 * breaks on the nested manifest.
 */
export function buildFaststorePackageJson(
  coreManifest: Record<string, unknown>,
  voltaConfig?: Record<string, unknown>
): Record<string, unknown> {
  const {
    exports: _exports,
    packageManager: _packageManager,
    ...rest
  } = coreManifest

  const existingScripts =
    (rest.scripts as Record<string, string> | undefined) ?? {}

  return {
    ...rest,
    name: 'dot-faststore',
    ...(voltaConfig ? { volta: voltaConfig } : {}),
    scripts: {
      ...existingScripts,
      generate: 'faststore generate',
      build: 'next build --webpack',
      serve: 'next serve',
      dev: 'next dev --webpack',
      'dev-only': 'next dev --webpack',
      predev: 'na run partytown',
      prebuild: 'na run partytown',
    },
  }
}

/**
 * Reads the `volta` config from the store root `package.json`, if present.
 * Returns `undefined` when the file or the field is missing so the generated
 * manifest stays untouched for stores that do not use Volta.
 */
function readRootVoltaConfig(
  rootDir: string
): Record<string, unknown> | undefined {
  try {
    const rootManifestPath = path.join(rootDir, 'package.json')

    if (!existsSync(rootManifestPath)) {
      return undefined
    }

    const rootManifest = JSON.parse(readFileSync(rootManifestPath, 'utf8'))

    return rootManifest?.volta
  } catch {
    return undefined
  }
}

/**
 * Prevents imports from @faststore/core from randomly conflicting
 * where sometimes the package.json from the .faststore folder
 * took precedence over @faststore/core's package.json.
 */
function filterAndCopyPackageJson(basePath: string) {
  const { coreDir, tmpDir, getRoot } = withBasePath(basePath)

  const coreManifest = JSON.parse(
    readFileSync(path.join(coreDir, 'package.json'), 'utf8')
  )

  const voltaConfig = readRootVoltaConfig(getRoot())

  const filteredFileContent = buildFaststorePackageJson(
    coreManifest,
    voltaConfig
  )

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

// File extensions allowed to be copied from the store's `public/` folder into
// the build. Fonts are included so stores can self-host them (GDPR / CWV)
// instead of relying on external CDNs.
export const PUBLIC_FILES_ALLOWED_EXTENSIONS = [
  '.json',
  '.txt',
  '.xml',
  '.ico',
  '.svg',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
  '.eot',
]

/**
 * Decides whether an entry from the store's `public/` folder should be copied
 * to the build. Directories always pass so nested assets can be reached, and
 * files are matched by their real extension (not a substring of the path).
 */
export function isPublicFileAllowed(
  src: string,
  isDirectory: boolean
): boolean {
  if (isDirectory) {
    return true
  }

  return PUBLIC_FILES_ALLOWED_EXTENSIONS.includes(
    path.extname(src).toLowerCase()
  )
}

export function copyPublicFiles(basePath: string) {
  const { userDir, tmpDir } = withBasePath(basePath)

  try {
    if (existsSync(`${userDir}/public`)) {
      copySync(`${userDir}/public`, `${tmpDir}/public`, {
        dereference: true,
        overwrite: true,
        filter: (src) => {
          try {
            return isPublicFileAllowed(src, statSync(src).isDirectory())
          } catch {
            // Skip entries we can't stat (dangling symlinks, permission
            // errors) so a single bad file never aborts the whole public/ copy.
            return false
          }
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
      userStoreConfig = (
        await import(pathToFileURL(path.resolve(userStoreConfigFile)).href)
      )?.default
    } else if (existsSync(userLegacyStoreConfigFile)) {
      userStoreConfig = (
        await import(
          pathToFileURL(path.resolve(userLegacyStoreConfigFile)).href
        )
      )?.default
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
      createNextJsPages(basePath)
    }
  } catch (err) {
    logger.error(`${chalk.red('error')} - ${err}`)
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
}

async function createCmsWebhookUrlsJsonFile(basePath: string) {
  const {
    userStoreConfigFile,
    userLegacyStoreConfigFile,
    tmpCMSWebhookUrlsFile,
  } = withBasePath(basePath)
  let userStoreConfig

  if (existsSync(userStoreConfigFile)) {
    userStoreConfig = (
      await import(pathToFileURL(path.resolve(userStoreConfigFile)).href)
    )?.default
  } else if (existsSync(userLegacyStoreConfigFile)) {
    userStoreConfig = (
      await import(pathToFileURL(path.resolve(userLegacyStoreConfigFile)).href)
    )?.default
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

  const storeConfigFile =
    (existsSync(userStoreConfigFile) && userStoreConfigFile) ||
    (existsSync(userLegacyStoreConfigFile) && userLegacyStoreConfigFile)

  const userStoreConfigFilePath =
    storeConfigFile && path.resolve(storeConfigFile)
  const importedStoreConfig =
    userStoreConfigFilePath &&
    (await import(pathToFileURL(userStoreConfigFilePath).href))
  const storeConfig =
    userStoreConfigFilePath &&
    (importedStoreConfig?.default || importedStoreConfig)

  if (!storeConfig)
    logger.info(
      `${chalk.blue(
        'info'
      )} - No store config file was found in the root directory`
    )

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
        }.scss file does not exist in the themes folder. Read more: https://developers.vtex.com/docs/guides/faststore/themes-overview`
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

async function checkDependencies(basePath: string, packagesToCheck: string[]) {
  const { coreDir, getRoot } = withBasePath(basePath)

  const corePackageJsonPath = path.join(coreDir, 'package.json')
  const rootPackageJsonPath = path.join(getRoot(), 'package.json')

  const { default: corePackageJson } = await import(
    pathToFileURL(corePackageJsonPath).href,
    {
      with: { type: 'json' },
    }
  )
  const { default: rootPackageJson } = await import(
    pathToFileURL(rootPackageJsonPath).href,
    {
      with: { type: 'json' },
    }
  )

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

// returns new (discovery.config.js) or legacy (faststore.config.js) store config file
function getCurrentUserStoreConfigFile(basePath: string) {
  const { userStoreConfigFile, userLegacyStoreConfigFile } =
    withBasePath(basePath)

  if (existsSync(userStoreConfigFile)) {
    return userStoreConfigFile
  }

  if (existsSync(userLegacyStoreConfigFile)) {
    return userLegacyStoreConfigFile
  }

  return null
}

async function validateAndInstallMissingDependencies(basePath: string) {
  const { userDir } = withBasePath(basePath)

  const currentUserStoreConfigFile = getCurrentUserStoreConfigFile(basePath)

  if (!currentUserStoreConfigFile) {
    return
  }

  const { default: userStoreConfig } = await import(
    pathToFileURL(currentUserStoreConfigFile).href
  )
  const { default: userPackageJson } = await import(
    pathToFileURL(path.join(userDir, 'package.json')).href,
    {
      with: { type: 'json' },
    }
  )

  const missingDependencies: Array<{
    feature: string
    dependencies: string[]
  }> = []

  if (userStoreConfig?.experimental?.preact) {
    missingDependencies.push({
      feature: 'Preact',
      dependencies: ['preact@10.23.1', 'preact-render-to-string@6.5.8'],
    })
  }

  missingDependencies.forEach(async ({ feature, dependencies }) => {
    const dependenciesToInstall = dependencies.filter((dependency) => {
      const dependencyName = dependency.split('@')[0]
      return !userPackageJson.dependencies[dependencyName]
    })

    if (dependenciesToInstall.length > 0) {
      const spinner = ora(
        `Installing ${feature} missing dependencies\n`
      ).start()

      await installDependencies({
        dependencies: dependenciesToInstall,
        cwd: userDir,
        errorMessage: `failed to install ${feature} dependencies`,
      })

      spinner.stop()
    }
  })
}

async function enableSearchSSR(basePath: string) {
  const storeConfigPath = getCurrentUserStoreConfigFile(basePath)

  if (!storeConfigPath) {
    return
  }
  const { default: storeConfig } = await import(
    pathToFileURL(storeConfigPath).href
  )
  if (!storeConfig.experimental.enableSearchSSR) {
    return
  }

  const { tmpDir } = withBasePath(basePath)
  const searchPagePath = path.join(tmpDir, 'src', 'pages', 's.tsx')
  const searchPageData = String(readFileSync(searchPagePath))

  const searchPageWithSSR = searchPageData.replaceAll(
    'getStaticProps',
    'getServerSideProps'
  )

  writeFileSync(searchPagePath, searchPageWithSSR)
}

export async function generate(options: GenerateOptions) {
  const { basePath, setup = false } = options

  let setupPromise: Promise<unknown> | null = null

  await validateAndInstallMissingDependencies(basePath)

  if (setup) {
    setupPromise = Promise.all([
      createTmpFolder(basePath),
      copyCoreFiles(basePath),
      copyCypressFiles(basePath),
      copyPublicFiles(basePath),
      updateNextConfig(basePath),
    ])
  }

  await Promise.all([
    setupPromise,
    checkDependencies(basePath, ['typescript']),
    enableSearchSSR(basePath),
    updateBuildTime(basePath),
    copyUserStarterToCustomizations(basePath),
    copyTheme(basePath),
    createCmsWebhookUrlsJsonFile(basePath),
    installPlugins(basePath),
  ])
}
