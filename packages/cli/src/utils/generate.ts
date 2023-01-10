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
} from 'fs-extra'

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
  userCMSDir,
  userNodeModulesDir,
  userSrcDir,
  userStoreConfigFileDir,
  userThemesFileDir,
} from './directory'

import chalk from 'chalk'

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
        const fileOrDirName = src.split('/').pop()
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

async function copyTheme() {
  const storeConfig = await import(userStoreConfigFileDir)
  if (storeConfig.theme) {
    const customTheme = `${userThemesFileDir}/${storeConfig.theme}.scss`
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
      // TODO: add link to our doc about creating a custom theme on faststore evergreen
      console.info(
        `${chalk.blue('info')} - The ${
          storeConfig.theme
        } theme was added to the config file but the ${
          storeConfig.theme
        }.scss file does not exist in the themes folder`
      )
    }
  } else if (
    existsSync(userThemesFileDir) &&
    readdirSync(userThemesFileDir).length > 0
  ) {
    // TODO: add link to our doc about creating a custom theme on faststore evergreen
    console.info(
      `${chalk.blue(
        'info'
      )} - The theme needs to be added to the config file to be applied`
    )
  }
}

function mergeCMSFile(fileName: string) {
  // TODO: create a validation when has the cms files but doesn't have a component for then
  if (existsSync(userCMSDir) && readdirSync(userCMSDir).length > 0) {
    const coreContentTypes = readFileSync(`${coreCMSDir}/${fileName}`, 'utf8')
    const customContentTypes = readFileSync(`${userCMSDir}/${fileName}`, 'utf8')
    const coreContentTypesJSON = JSON.parse(coreContentTypes)
    const customContentTypesJSON = JSON.parse(customContentTypes)

    const mergeContentTypes = [
      ...coreContentTypesJSON,
      ...customContentTypesJSON,
    ]

    try {
      writeFileSync(
        `${tmpCMSDir}/${fileName}`,
        JSON.stringify(mergeContentTypes)
      )
      console.log(
        `${chalk.green('success')} - CMS file ${chalk.dim(fileName)} created`
      )
    } catch (err) {
      console.error(`${chalk.red('error')} - ${err}`)
    }
  }
}

function generateStoreConfigFile(content: any) {
  return `module.exports = ${JSON.stringify(content, null, 2)}\n`
}

async function copyStoreConfig() {
  try {
    const storeConfigFromStore = await import(userStoreConfigFileDir)
    const storeConfigFromCore = await import(coreStoreConfigFileDir)

    const mergedStoreConfig = deepmerge(
      storeConfigFromCore,
      storeConfigFromStore
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
      createNodeModulesSymbolicLink(),
    ])
  }

  await Promise.all([
    setupPromise,
    copyUserSrcToCustomizations(),
    copyTheme(),
    mergeCMSFiles(),
    copyStoreConfig(),
  ])
}
