import deepmerge from 'deepmerge'
import {
  copyFileSync,
  copySync,
  existsSync,
  mkdirsSync,
  readFileSync,
  removeSync,
  symlinkSync,
  writeFileSync,
} from 'fs-extra'

import {
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
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  } finally {
    console.log(
      `${chalk.green('success')} - Temporary folder ${chalk.dim(
        tmpFolderName
      )} created`
    )
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
  } catch (e) {
    console.error(e)
  } finally {
    console.log(`${chalk.green('success')} - Core files copied`)
  }
}

function copyUserSrcToCustomizations() {
  try {
    copySync(userSrcDir, tmpCustomizationsDir)
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  } finally {
    console.log(`${chalk.green('success')} - Custom files copied`)
  }
}

async function copyTheme() {
  const storeConfig = await import(userStoreConfigFileDir)

  try {
    copyFileSync(
      `${userThemesFileDir}/${storeConfig.theme}.scss`,
      tmpThemesCustomizationsFileDir
    )
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  } finally {
    console.log(`${chalk.green('success')} - Custom styles copied`)
  }
}

function mergeCMSFile(fileName: string) {
  const coreContentTypes = readFileSync(`${coreCMSDir}/${fileName}`, 'utf8')
  const customContentTypes = readFileSync(`${userCMSDir}/${fileName}`, 'utf8')
  const coreContentTypesJSON = JSON.parse(coreContentTypes)
  const customContentTypesJSON = JSON.parse(customContentTypes)

  const mergeContentTypes = [...coreContentTypesJSON, ...customContentTypesJSON]

  try {
    writeFileSync(`${tmpCMSDir}/${fileName}`, JSON.stringify(mergeContentTypes))
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  } finally {
    console.log(
      `${chalk.green('success')} - CMS file ${chalk.dim(fileName)} created`
    )
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
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  } finally {
    console.log(
      `${chalk.green('success')} - File ${chalk.dim('store.config.js')} copied`
    )
  }
}

function mergeCMSFiles() {
  try {
    mkdirsSync(`${tmpDir}/cms`)
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  } finally {
    console.log(`${chalk.green('success')} - CMS folder created`)
  }

  mergeCMSFile('content-types.json')
  mergeCMSFile('sections.json')
}

function createNodeModulesSymbolicLink() {
  try {
    symlinkSync(userNodeModulesDir, tmpNodeModulesDir)
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }

  console.log(
    `${chalk.green('success')} - Symbolic ${chalk.dim(
      'node_modules'
    )} link created from ${chalk.dim(userNodeModulesDir)} to ${chalk.dim(
      tmpNodeModulesDir
    )}`
  )
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
