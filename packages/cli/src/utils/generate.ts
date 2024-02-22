import {
  copyFileSync,
  copySync,
  existsSync,
  mkdirsSync,
  readdirSync,
  removeSync,
  writeJsonSync,
} from 'fs-extra'
import path from 'path'
import chalk from 'chalk'

import {
  coreDir,
  tmpDir,
  tmpFolderName,
  tmpStoreConfigFileDir,
  tmpThemesCustomizationsFileDir,
  tmpCmsWebhookUrlsFileDir,
  userSrcDir,
  userStoreConfigFileDir,
  userThemesFileDir,
  userDir,
  tmpCustomizationsSrcDir,
} from './directory'
import { mergeCMSFiles } from './hcms'

interface GenerateOptions {
  setup?: boolean
}

// package.json is copied manually after filtering its content
const ignorePaths = ['package.json', 'node_modules', 'cypress.config.ts']

function createTmpFolder() {
  try {
    if (existsSync(tmpDir)) {
      removeSync(tmpDir)
    }

    mkdirsSync(tmpDir)
    console.log(
      `${chalk.green('success')} - Temporary folder ${chalk.dim(
        tmpFolderName
      )} created`
    )
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}

/**
 * Prevents imports from @faststore/core from randomly conflicting
 * where sometimes the package.json from the .faststore folder
 * took precedence over @faststore/core's package.json.
 */
function filterAndCopyPackageJson() {
  const corePackageJsonPath = path.join(coreDir, 'package.json')

  const corePackageJsonFile = readFileSync(corePackageJsonPath, 'utf8')
  let { exports: _, ...filteredFileContent } = JSON.parse(corePackageJsonFile)

  filteredFileContent.name = 'dot-faststore'

  writeJsonSync(path.join(tmpDir, 'package.json'), filteredFileContent, {
    spaces: 2,
  })
}

function copyCoreFiles() {
  try {
    copySync(coreDir, tmpDir, {
      filter(src) {
        const fileOrDirName = path.basename(src)
        const shouldCopy = fileOrDirName
          ? !ignorePaths.includes(fileOrDirName)
          : true

        return shouldCopy
      },
    })

    filterAndCopyPackageJson()

    console.log(`${chalk.green('success')} - Core files copied`)
  } catch (e) {
    console.error(e)
  }
}

function copyPublicFiles() {
  const allowList = ['json', 'txt', 'xml', 'ico', 'public']
  try {
    if (existsSync(`${userDir}/public`)) {
      copySync(`${userDir}/public`, `${tmpDir}/public`, {
        overwrite: true,
        filter: (src) => {
          const allow = allowList.some((ext) => src.endsWith(ext))

          return allow
        },
      })
      console.log(`${chalk.green('success')} - Public files copied`)
    }
  } catch (e) {
    console.error(e)
  }
}

async function copyCypressFiles() {
  try {
    // Cypress 9.x config file
    if (existsSync(`${userDir}/cypress.json`)) {
      copySync(`${userDir}/cypress.json`, `${tmpDir}/cypress.json`)
    }

    // Cypress 12.x config file
    if (existsSync(`${userDir}/cypress.config.ts`)) {
      copySync(`${userDir}/cypress.config.ts`, `${tmpDir}/cypress.config.ts`)
    }

    const userStoreConfig = await import(userStoreConfigFileDir)

    // Copy custom Cypress folder and files
    if (
      existsSync(`${userDir}/cypress`) &&
      userStoreConfig?.experimental?.enableCypressExtension
    ) {
      copySync(`${userDir}/cypress`, `${tmpDir}/cypress`, {
        overwrite: true,
      })

      console.log(`${chalk.green('success')} - Cypress test files copied`)
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
    console.error(e)
  }
}

function copyUserStarterToCustomizations() {
  try {
    if (existsSync(userSrcDir) && readdirSync(userSrcDir).length > 0) {
      copySync(userSrcDir, tmpCustomizationsSrcDir)
    }

    if (existsSync(userStoreConfigFileDir)) {
      copySync(userStoreConfigFileDir, tmpStoreConfigFileDir)
    }

    console.log(`${chalk.green('success')} - Starter files copied`)
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}

async function createCmsWebhookUrlsJsonFile() {
  const userStoreConfig = await import(userStoreConfigFileDir)

  if (
    userStoreConfig?.vtexHeadlessCms &&
    userStoreConfig.vtexHeadlessCms?.webhookUrls
  ) {
    const { webhookUrls } = userStoreConfig?.vtexHeadlessCms

    try {
      writeJsonSync(
        tmpCmsWebhookUrlsFileDir,
        { urls: webhookUrls },
        { spaces: 2 }
      )
      console.log(`${chalk.green('success')} - CMS webhook URLs file created`)
    } catch (err) {
      console.error(`${chalk.red('error')} - ${err}`)
    }
  } else {
    console.info(`${chalk.blue('info')} - No CMS webhook URLs were provided`)
  }
}

async function copyTheme() {
  const storeConfig = await import(userStoreConfigFileDir)
  if (storeConfig.theme) {
    const customTheme = path.join(
      userThemesFileDir,
      `${storeConfig.theme}.scss`
    )
    if (existsSync(customTheme)) {
      try {
        copyFileSync(customTheme, tmpThemesCustomizationsFileDir)
        console.log(
          `${chalk.green('success')} - ${
            storeConfig.theme
          } theme has been applied`
        )
      } catch (err) {
        console.error(`${chalk.red('error')} - ${err}`)
      }
    } else {
      console.info(
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
    console.info(
      `${chalk.blue(
        'info'
      )} - The theme needs to be added to the config file to be applied. Read more: https://www.faststore.dev/docs/themes/overview`
    )
  }
}

export async function generate(options?: GenerateOptions) {
  const { setup = false } = options ?? {}

  let setupPromise: Promise<unknown> | null = null

  if (setup) {
    setupPromise = Promise.all([
      createTmpFolder(),
      copyCoreFiles(),
      copyCypressFiles(),
      copyPublicFiles(),
    ])
  }

  await Promise.all([
    setupPromise,
    copyUserStarterToCustomizations(),
    copyTheme(),
  ])
}

export async function generateCMSFiles() {
  await createCmsWebhookUrlsJsonFile()
  await mergeCMSFiles()
}
