import chalk from 'chalk'
import path from 'node:path'
// import { ux } from '@oclif/core'
import { confirm } from '@inquirer/prompts'
import fsExtra from 'fs-extra'
const { readFileSync, existsSync, writeFileSync, mkdirSync } = fsExtra

import { pathToFileURL } from 'node:url'
import { getDisabledSections } from './config'
import { withBasePath } from './directory'
import { logger } from './logger'
import { getPluginName, getPluginsList } from './plugins'

export interface ContentTypeOrSectionDefinition {
  id?: string
  name?: string
  scopes?: string[]
  isSingleton?: boolean
  onlySettings?: boolean
  requiredScopes?: string[]
  schema?: Record<string, unknown>
  configurationSchemaSets?: ConfigurationSchemaSet[]
}

export interface ConfigurationSchemaSet {
  name?: string
  configurations?: Array<{
    name?: string
    schema?: Record<string, unknown>
  }>
}

export function splitCustomDefinitions(
  coreDefinitions: ContentTypeOrSectionDefinition[],
  customDefinitions: ContentTypeOrSectionDefinition[],
  primaryIdentifier: 'id' | 'name'
) {
  const coreDefinitionIdentifiers = new Set<string>(
    coreDefinitions.map((definition) => definition[primaryIdentifier] ?? '')
  )

  const duplicates: ContentTypeOrSectionDefinition[] = []
  const newDefinitions: ContentTypeOrSectionDefinition[] = []

  customDefinitions.forEach((definition) => {
    if (!definition[primaryIdentifier]) {
      console.error('Ignoring invalid definition:', definition)
      return
    }

    if (
      coreDefinitionIdentifiers.has(definition[primaryIdentifier] as string)
    ) {
      duplicates.push(definition)
      return
    }

    newDefinitions.push(definition)
  })

  return { duplicates, newDefinitions }
}

export function dedupeAndMergeDefinitions(
  coreDefinitions: ContentTypeOrSectionDefinition[],
  duplicates: ContentTypeOrSectionDefinition[],
  primaryIdentifier: 'id' | 'name'
) {
  const sortedCoreDefs = coreDefinitions.filter((definition) =>
    Boolean(definition[primaryIdentifier])
  )
  sortedCoreDefs.sort((a, b) =>
    (a[primaryIdentifier] as string) < (b[primaryIdentifier] as string) ? -1 : 1
  )

  const sortedDuplicates = duplicates.filter((definition) =>
    Boolean(definition[primaryIdentifier])
  )
  sortedDuplicates.sort((a, b) =>
    (a[primaryIdentifier] as string) < (b[primaryIdentifier] as string) ? -1 : 1
  )

  let duplicateIdx = 0

  const result = sortedCoreDefs.map((currentDefinition) => {
    const isDuplicateMatch =
      currentDefinition[primaryIdentifier] ===
      sortedDuplicates[duplicateIdx]?.[primaryIdentifier]

    if (duplicateIdx < sortedDuplicates.length && isDuplicateMatch) {
      return sortedDuplicates[duplicateIdx++]
    }

    return currentDefinition
  })

  return result
}

/**
 * Removes the section definitions whose `name` is listed in `disabledNames`,
 * so they are not synced to the CMS Admin section picker.
 *
 * Returns the remaining sections, the names that were hidden, and the
 * configured names that matched no section (likely typos).
 */
export function filterDisabledSections(
  definitions: ContentTypeOrSectionDefinition[],
  disabledNames: string[]
) {
  const disabled = new Set(disabledNames)
  const hidden = new Set<string>()

  const sections = definitions.filter((definition) => {
    if (definition.name && disabled.has(definition.name)) {
      hidden.add(definition.name)
      return false
    }

    return true
  })

  const unknown = disabledNames.filter((name) => !hidden.has(name))

  return { sections, hidden: Array.from(hidden), unknown }
}

async function confirmUserChoice(
  duplicates: ContentTypeOrSectionDefinition[],
  fileName: string
) {
  const goAhead = await confirm({
    message: `You are about to override default ${
      fileName.split('.')[0]
    }:\n\n${duplicates
      .map((definition) => definition.id || definition.name)
      .join('\n')}\n\nAre you sure? [yes/no]`,
  })

  if (!goAhead) {
    throw new Error('cms-sync cancelled by user.')
  }

  return
}

export async function mergeCMSFile(fileName: string, basePath: string) {
  const {
    coreCMSDir,
    userCMSDir,
    tmpCMSDir,
    getPackagePath,
    userStoreConfigFile,
  } = withBasePath(basePath)

  const { default: userStoreConfig } = await import(
    pathToFileURL(path.resolve(userStoreConfigFile)).href
  )
  const cmsProjectName = userStoreConfig.contentSource?.project ?? 'faststore'

  const coreFilePath = path.join(coreCMSDir, fileName)
  const customFilePath = path.join(userCMSDir, fileName)

  const coreFile = readFileSync(coreFilePath, 'utf8')
  const coreDefinitions: ContentTypeOrSectionDefinition[] = JSON.parse(coreFile)

  const primaryIdentifierForDefinitions =
    fileName === 'content-types.json' ? 'id' : 'name'

  let output: ContentTypeOrSectionDefinition[] = coreDefinitions

  const plugins = await getPluginsList(basePath)

  const pluginCMSFilePaths = plugins.map((plugin) =>
    getPackagePath(getPluginName(plugin), 'cms', 'faststore', fileName)
  )

  const customizations = [...pluginCMSFilePaths, customFilePath].filter(
    (pluginCMSFilePath) => existsSync(pluginCMSFilePath)
  )

  // TODO: create a validation when the CMS files exist but don't have a component for them
  for (const newFilePath of customizations) {
    const customFile = readFileSync(newFilePath, 'utf8')

    try {
      const customDefinitions = JSON.parse(customFile)

      const { duplicates, newDefinitions } = splitCustomDefinitions(
        output,
        customDefinitions,
        primaryIdentifierForDefinitions
      )

      if (duplicates.length) {
        if (newFilePath === customFilePath) {
          await confirmUserChoice(duplicates, fileName)
        }

        output = [
          ...dedupeAndMergeDefinitions(
            output,
            duplicates,
            primaryIdentifierForDefinitions
          ),
          ...newDefinitions,
        ]
      } else {
        output = [...output, ...newDefinitions]
      }
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

  // Applied after every plugin and store merge so that disabling a section
  // wins over overriding it.
  if (fileName === 'sections.json') {
    const disabledSections = getDisabledSections(userStoreConfig)

    if (disabledSections.length > 0) {
      const { sections, hidden, unknown } = filterDisabledSections(
        output,
        disabledSections
      )

      output = sections

      if (hidden.length) {
        logger.info(
          `${chalk.blue('info')} - Hiding disabled sections from the CMS: ${hidden.join(', ')}`
        )
      }

      unknown.forEach((name) => {
        logger.warn(
          `${chalk.yellow('warning')} - contentSource.disabledSections: no section named "${name}" was found in ${fileName}.`
        )
      })
    }
  }

  try {
    if (!existsSync(tmpCMSDir(cmsProjectName))) {
      mkdirSync(tmpCMSDir(cmsProjectName))
    }
    writeFileSync(
      path.join(tmpCMSDir(cmsProjectName), fileName),
      JSON.stringify(output)
    )
    console.log(
      `${chalk.green('success')} - CMS file ${chalk.dim(fileName)} created`
    )
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}

export async function mergeCMSFiles(basePath: string) {
  try {
    await mergeCMSFile('content-types.json', basePath)
    await mergeCMSFile('sections.json', basePath)
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}
