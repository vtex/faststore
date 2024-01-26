import {
  copyFileSync,
  copySync,
  existsSync,
  mkdirsSync,
  readdirSync,
  readFileSync,
  removeSync,
  symlinkSync,
  writeFileSync,
  writeJsonSync,
} from 'fs-extra'

import path from 'path'

import {
  coreCMSDir,
  coreDir,
  tmpCMSDir,
  tmpDir,
  tmpFolderName,
  tmpNodeModulesDir,
  tmpStoreConfigFileDir,
  tmpThemesCustomizationsFileDir,
  tmpCmsWebhookUrlsFileDir,
  userCMSDir,
  userNodeModulesDir,
  userSrcDir,
  userStoreConfigFileDir,
  userThemesFileDir,
  userDir,
  tmpCustomizationsSrcDir,
} from './directory'

import chalk from 'chalk'

interface GenerateOptions {
  setup?: boolean
}

const ignorePaths = ['node_modules', 'cypress.config.ts']

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
    console.log(`${chalk.green('success')} - Core files copied`)
  } catch (e) {
    console.error(e)
  }
}

function copyPublicFiles() {
  const allowList = ["json", "txt", "xml", "ico", "public"]
  try {
    if (existsSync(`${userDir}/public`)) {
      copySync(`${userDir}/public`, `${tmpDir}/public`, {
        overwrite: true,
        filter: (src) => {
          const allow = allowList.some((ext) => src.endsWith(ext))

          return allow
        }
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

function mergeCMSFile(fileName: string) {
  const customFilePath = path.join(userCMSDir, fileName)
  const coreFilePath = path.join(coreCMSDir, fileName)

  const coreFile = readFileSync(coreFilePath, 'utf8')
  const output = [...JSON.parse(coreFile)]

  // TODO: create a validation when has the cms files but doesn't have a component for then
  if (existsSync(customFilePath)) {
    const customFile = readFileSync(customFilePath, 'utf8')

    try {
      output.push(...JSON.parse(customFile))
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.info(
          `${chalk.red(
            'error'
          )} - ${fileName} is a malformed JSON file, ignoring its contents.`
        )
      } else {
        throw err
      }
    }
  }

  try {
    writeFileSync(path.join(tmpCMSDir, fileName), JSON.stringify(output))
    console.log(
      `${chalk.green('success')} - CMS file ${chalk.dim(fileName)} created`
    )
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}

function mergeCMSFiles() {
  mergeCMSFile('content-types.json')
  mergeCMSFile('sections.json')
}

function copyUserNodeModules() {
  try {
    symlinkSync(userNodeModulesDir, tmpNodeModulesDir, 'dir')
    console.log(
      `${chalk.green('success')} - ${chalk.dim('node_modules')} files copied`
    )
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
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
      copyUserNodeModules(),
    ])
  }

  await Promise.all([
    setupPromise,
    copyUserStarterToCustomizations(),
    copyTheme(),
    createCmsWebhookUrlsJsonFile(),
    mergeCMSFiles(),
  ])
}
