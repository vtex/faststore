import deepmerge from 'deepmerge'
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
  configFileName,
  coreCMSDir,
  coreDir,
  coreStoreConfigFileDir,
  tmpCMSDir,
  tmpCustomizationsDir,
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
} from './directory'

import chalk from 'chalk'
import stringifyObject from 'stringify-object'

interface GenerateOptions {
  setup?: boolean
}

const ignorePaths = ['node_modules']

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

async function copyCypressFiles() {
  try {
    const userStoreConfig = await import(userStoreConfigFileDir)
    if (userStoreConfig?.experimental?.enableCypressExtension) {
      copySync(`${userDir}/cypress`, `${tmpDir}/cypress/integration`, {overwrite: true})
      console.log(`${chalk.green('success')} - Cypress test files copied`)
    }
  } catch (e) {
    console.error(e)
  }
}

function copyUserSrcToCustomizations() {
  if (existsSync(userSrcDir) && readdirSync(userSrcDir).length > 0) {
    try {
      copySync(userSrcDir, tmpCustomizationsDir)
      console.log(`${chalk.green('success')} - Custom files copied`)
    } catch (err) {
      console.error(`${chalk.red('error')} - ${err}`)
    }
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

function generateStoreConfigFile(content: any) {
  const prettyObject = stringifyObject(content, {
    indent: '  ',
    singleQuotes: false,
  })
  return `module.exports = ${prettyObject}\n`
}

async function copyStoreConfig() {
  try {
    const storeConfigFromCore = await import(coreStoreConfigFileDir)
    const storeConfigFromStore = await import(userStoreConfigFileDir)

    // avoid duplicate default values
    const { default: _, ...otherCoreProps } = storeConfigFromCore
    const { default: __, ...otherStoreProps } = storeConfigFromStore

    const mergedStoreConfig = deepmerge(
      { ...otherCoreProps },
      { ...otherStoreProps }
    )

    writeFileSync(
      tmpStoreConfigFileDir,
      generateStoreConfigFile(mergedStoreConfig)
    )
    console.log(
      `${chalk.green('success')} - File ${chalk.dim(configFileName)} copied`
    )
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}

function mergeCMSFiles() {
  mergeCMSFile('content-types.json')
  mergeCMSFile('sections.json')
}

function createNodeModulesSymbolicLink() {
  try {
    symlinkSync(userNodeModulesDir, tmpNodeModulesDir)
    console.log(
      `${chalk.green('success')} - Symbolic ${chalk.dim(
        'node_modules'
      )} link created from ${chalk.dim(userNodeModulesDir)} to ${chalk.dim(
        tmpNodeModulesDir
      )}`
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
      createNodeModulesSymbolicLink(),
    ])
  }

  await Promise.all([
    setupPromise,
    copyUserSrcToCustomizations(),
    copyTheme(),
    createCmsWebhookUrlsJsonFile(),
    mergeCMSFiles(),
    copyStoreConfig(),
  ])
}
