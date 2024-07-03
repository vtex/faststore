import path from 'path'
import chalk from 'chalk'
import { CliUx } from '@oclif/core'
import { readFileSync, existsSync, writeFileSync } from 'fs-extra'

// FIXME: Use withBasePath
// import { userCMSDir, coreCMSDir, tmpCMSDir } from './directory'
const userCMSDir = ''
const coreCMSDir = ''
const tmpCMSDir = ''

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

async function confirmUserChoice(
  duplicates: ContentTypeOrSectionDefinition[],
  fileName: string
) {
  const goAhead = await CliUx.ux.confirm(
    `You are about to override default ${fileName.split('.')[0]
    }:\n\n${duplicates
      .map((definition) => definition.id || definition.name)
      .join('\n')}\n\nAre you sure? [yes/no]`
  )

  if (!goAhead) {
    throw new Error('cms-sync cancelled by user.')
  }

  return
}

export async function mergeCMSFile(fileName: string) {
  const coreFilePath = path.join(coreCMSDir, fileName)
  const customFilePath = path.join(userCMSDir, fileName)

  const coreFile = readFileSync(coreFilePath, 'utf8')
  const coreDefinitions: ContentTypeOrSectionDefinition[] = JSON.parse(coreFile)

  const primaryIdentifierForDefinitions =
    fileName === 'content-types.json' ? 'id' : 'name'

  let output: ContentTypeOrSectionDefinition[] = coreDefinitions

  // TODO: create a validation when the CMS files exist but don't have a component for them
  if (existsSync(customFilePath)) {
    const customFile = readFileSync(customFilePath, 'utf8')

    try {
      const customDefinitions = JSON.parse(customFile)

      const { duplicates, newDefinitions } = splitCustomDefinitions(
        coreDefinitions,
        customDefinitions,
        primaryIdentifierForDefinitions
      )

      if (duplicates.length) {
        await confirmUserChoice(duplicates, fileName)

        output = [
          ...dedupeAndMergeDefinitions(
            coreDefinitions,
            duplicates,
            primaryIdentifierForDefinitions
          ),
          ...newDefinitions,
        ]
      } else {
        output = [...coreDefinitions, ...newDefinitions]
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

  try {
    writeFileSync(path.join(tmpCMSDir, fileName), JSON.stringify(output))
    console.log(
      `${chalk.green('success')} - CMS file ${chalk.dim(fileName)} created`
    )
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}

export async function mergeCMSFiles() {
  try {
    await mergeCMSFile('content-types.json')
    await mergeCMSFile('sections.json')
  } catch (err) {
    console.error(`${chalk.red('error')} - ${err}`)
  }
}
