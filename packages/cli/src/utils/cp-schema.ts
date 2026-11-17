/**
 * CP (Content Platform) schema helpers for `cms-sync`.
 * Generates and uploads the store's custom CMS schema via `vtex content`.
 * Store context only: no `-l` / base.jsonc.
 */
import chalk from 'chalk'
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { withBasePath } from './directory'
import { logger } from './logger'
import { runCommandSync } from './runCommandSync'

const CP_MERGE_SUBDIRS = ['components', 'pages'] as const

const CP_COMPONENT_FILE_REGEX = /^cms_component__.*\.jsonc?$/
const CP_CONTENT_TYPE_FILE_REGEX = /^cms_content_type__.*\.jsonc?$/
const ALLOW_ALL_COMPONENTS_REF = '#/$defs/$ALLOW_ALL_COMPONENTS'
// The base page template declares `sections: $ALLOW_ALL_COMPONENTS`, so a
// content-type that extends it without its own `sections` inherits it.
const BASE_PAGE_TEMPLATE_REF_REGEX = /\/base-page-template$/

// Sub-folder of the staged `pages` dir that holds the generated overrides of
// the core content-types, so they never collide with a store file name.
const CORE_PAGES_OVERRIDE_SUBDIR = 'faststore-core'

export function getExistingCpDirs(basePath: string): string[] {
  const { userCMSDir } = withBasePath(basePath)
  const componentsDir = path.join(userCMSDir, 'components')
  const pagesDir = path.join(userCMSDir, 'pages')

  return [componentsDir, pagesDir]
    .filter((dir) => existsSync(dir))
    .map((dir) => path.relative(basePath, dir))
}

export function errorNoCustomization(): never {
  logger.error(
    `${chalk.red('[Error]')} - No CMS customization found. Expected cms/faststore/components and/or cms/faststore/pages.`
  )
  process.exit(1)
}

export function getCpSchemaOutputPath(basePath: string): string {
  // Relative to basePath: the toolbelt resolves -o against the cwd
  // (path.join(cwd, arg)), so an absolute path would be doubled into
  // <store>/<store>/cms/... and fail with ENOENT.
  return path.relative(
    basePath,
    path.join(withBasePath(basePath).userCMSDir, 'schema.json')
  )
}

export type CpMerge = {
  /** Absolute root directory holding the merged JSONC. */
  mergeDir: string
  /**
   * Paths of the two merged directories, relative to `basePath` and ordered as
   * `[components, pages]`, so they can be passed positionally to
   * `generate-schema <componentsPath> <pagesPath>`.
   */
  dirs: string[]
}

export type CpMergeOptions = {
  /** Merge the core My Account schemas (`experimental.enableFaststoreMyAccount`). */
  includeMyAccount: boolean
  /** Component keys to hide from the section picker (`contentSource.disabledSections`). */
  disabledSections: string[]
}

/**
 * Builds a staging directory with exactly two subdirectories (`components` and
 * `pages`), each holding the file-level merge of the core My Account CMS JSONC
 * (when `includeMyAccount`) and the store's own customizations, ready to be
 * fed to `generate-schema <componentsPath> <pagesPath>`. When
 * `disabledSections` is not empty, the staged content-types are then
 * restricted so those sections are hidden (see `hideDisabledSections`).
 *
 * The staging dir lives inside the store's `.faststore` tmp folder (created on
 * demand) and the returned paths are relative to `basePath`. The toolbelt
 * resolves positional args against the cwd (`path.join(cwd, arg)`), so an
 * absolute path under `os.tmpdir()` would be mangled into `<store>/var/...`
 * and fail with ENOENT.
 *
 * The My Account schemas are intentionally excluded from the published base
 * schema (and the Schema Registry), so they must be supplied locally when the
 * `experimental.enableFaststoreMyAccount` flag is on. They are copied from the
 * installed `@faststore/core`.
 *
 * Exits the process when My Account is included but the core My Account
 * schemas are not found.
 */
export function prepareCpMergeDir(
  basePath: string,
  { includeMyAccount, disabledSections }: CpMergeOptions
): CpMerge {
  const { coreCMSDir, userCMSDir, tmpDir } = withBasePath(basePath)
  const coreMyAccountDir = path.join(coreCMSDir, 'my-account')

  if (includeMyAccount && !existsSync(coreMyAccountDir)) {
    logger.error(
      `${chalk.red('[Error]')} - My Account is enabled but the core My Account schemas were not found at ${coreMyAccountDir}. Update @faststore/core or disable experimental.enableFaststoreMyAccount.`
    )
    process.exit(1)
  }

  // `.faststore` may not exist yet in the CP flow (it does not run `generate`).
  mkdirSync(tmpDir, { recursive: true })
  const mergeDir = mkdtempSync(path.join(tmpDir, 'cms-merge-'))

  try {
    const dirs: string[] = []
    for (const subdir of CP_MERGE_SUBDIRS) {
      const dest = path.join(mergeDir, subdir)
      mkdirSync(dest, { recursive: true })

      // Core My Account first; the store's customizations override on collision.
      const coreSource = path.join(coreMyAccountDir, subdir)
      if (includeMyAccount && existsSync(coreSource)) {
        cpSync(coreSource, dest, { recursive: true })
      }

      const storeSource = path.join(userCMSDir, subdir)
      if (existsSync(storeSource)) {
        cpSync(storeSource, dest, { recursive: true })
      }

      dirs.push(path.relative(basePath, dest))
    }

    if (disabledSections.length > 0) {
      hideDisabledSections({
        coreCMSDir,
        userCMSDir,
        mergeDir,
        disabledSections,
      })
    }

    return { mergeDir, dirs }
  } catch (error) {
    cleanupCpMergeDir(mergeDir)
    throw error
  }
}

/**
 * Hides `disabledSections` from the section picker of every content-type.
 *
 * The toolbelt generates `$ALLOW_ALL_COMPONENTS` from every component, base
 * included, and has no way to exclude one. Instead, each content-type whose
 * `sections` points to it (directly or inherited from the base page template)
 * gets an explicit `anyOf` listing every core, My Account and store component
 * except the disabled ones:
 * - content-types already staged (My Account and store) are rewritten in place;
 * - core content-types are written as overrides under
 *   `pages/faststore-core/`, unless the store defines the same key (the
 *   store's definition wins).
 *
 * Content-types that declare their own explicit `sections` list are left as is.
 * Throws when a schema file cannot be parsed, since skipping it would silently
 * drop a section from the picker or duplicate a content-type.
 */
function hideDisabledSections({
  coreCMSDir,
  userCMSDir,
  mergeDir,
  disabledSections,
}: {
  coreCMSDir: string
  userCMSDir: string
  mergeDir: string
  disabledSections: string[]
}): void {
  const stagedPagesDir = path.join(mergeDir, 'pages')

  // Errors point to the store's own file rather than its temporary staged copy.
  const read = (filePath: string) => {
    const storePath = path.join(userCMSDir, path.relative(mergeDir, filePath))
    const isStoreFile = filePath.startsWith(mergeDir) && existsSync(storePath)

    return readSchemaFile(filePath, isStoreFile ? storePath : filePath)
  }

  const componentKeys = Array.from(
    new Set(
      [
        ...listSchemaFiles(
          path.join(coreCMSDir, 'components'),
          CP_COMPONENT_FILE_REGEX
        ),
        ...listSchemaFiles(
          path.join(mergeDir, 'components'),
          CP_COMPONENT_FILE_REGEX
        ),
      ]
        .map((filePath) => read(filePath))
        .map((schema) =>
          isRecord(schema) && typeof schema.$componentKey === 'string'
            ? schema.$componentKey
            : ''
        )
        .filter(Boolean)
    )
  )

  const disabled = new Set(disabledSections)
  const hidden = disabledSections.filter((name) => componentKeys.includes(name))
  const unknown = disabledSections.filter(
    (name) => !componentKeys.includes(name)
  )

  unknown.forEach((name) => {
    logger.warn(
      `${chalk.yellow('[Warning]')} - contentSource.disabledSections: no component with $componentKey "${name}" was found.`
    )
  })

  const sections = {
    type: 'array',
    items: {
      anyOf: componentKeys
        .filter((key) => !disabled.has(key))
        .map((key) => ({ $ref: `#/components/${key}` })),
    },
  }

  const stagedContentTypeKeys = new Set<string>()
  let restrictedCount = 0

  for (const filePath of listSchemaFiles(
    stagedPagesDir,
    CP_CONTENT_TYPE_FILE_REGEX
  )) {
    const contentTypes = read(filePath)

    if (!isRecord(contentTypes)) {
      continue
    }

    Object.keys(contentTypes).forEach((key) => stagedContentTypeKeys.add(key))

    const restricted = restrictSections(contentTypes, sections)

    if (restricted.length) {
      restrictedCount += restricted.length
      writeFileSync(filePath, JSON.stringify(contentTypes, null, 2))
    }
  }

  const coreOverridesDir = path.join(stagedPagesDir, CORE_PAGES_OVERRIDE_SUBDIR)

  for (const filePath of listSchemaFiles(
    path.join(coreCMSDir, 'pages'),
    CP_CONTENT_TYPE_FILE_REGEX
  )) {
    const contentTypes = read(filePath)

    if (!isRecord(contentTypes)) {
      continue
    }

    const overridable = Object.fromEntries(
      Object.entries(contentTypes).filter(
        ([key]) => !stagedContentTypeKeys.has(key)
      )
    )
    const restricted = restrictSections(overridable, sections)

    if (!restricted.length) {
      continue
    }

    restrictedCount += restricted.length
    mkdirSync(coreOverridesDir, { recursive: true })
    writeFileSync(
      path.join(coreOverridesDir, path.basename(filePath)),
      JSON.stringify(
        Object.fromEntries(restricted.map((key) => [key, overridable[key]])),
        null,
        2
      )
    )
  }

  if (!hidden.length) {
    return
  }

  if (restrictedCount === 0) {
    logger.warn(
      `${chalk.yellow('[Warning]')} - contentSource.disabledSections: every content-type declares its own sections list, so no section was hidden.`
    )
    return
  }

  logger.info(
    `${chalk.blue('[Info]')} - Hiding disabled sections from the CMS: ${hidden.join(', ')} (${restrictedCount} content-types restricted)`
  )
}

/**
 * Replaces `sections` with the given schema in every content-type whose
 * `sections` points to `$ALLOW_ALL_COMPONENTS`, or that inherits it by
 * extending the base page template without declaring `sections`. Mutates
 * `contentTypes` and returns the keys that were changed.
 */
function restrictSections(
  contentTypes: Record<string, unknown>,
  sections: Record<string, unknown>
): string[] {
  return Object.keys(contentTypes).filter((key) => {
    const contentType = contentTypes[key]

    if (!isRecord(contentType)) {
      return false
    }

    const properties = isRecord(contentType.properties)
      ? contentType.properties
      : undefined

    if (
      isRecord(properties?.sections) &&
      properties.sections.$ref === ALLOW_ALL_COMPONENTS_REF
    ) {
      properties.sections = sections
      return true
    }

    const extendsBasePageTemplate =
      Array.isArray(contentType.$extends) &&
      contentType.$extends.some(
        (ref) =>
          typeof ref === 'string' && BASE_PAGE_TEMPLATE_REF_REGEX.test(ref)
      )

    if (properties?.sections === undefined && extendsBasePageTemplate) {
      contentType.properties = { ...properties, sections }
      return true
    }

    return false
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Lists the schema files matching `fileNameRegex` under `dir`, recursively,
 * as the toolbelt does. Returns absolute paths, sorted.
 */
function listSchemaFiles(dir: string, fileNameRegex: RegExp): string[] {
  if (!existsSync(dir)) {
    return []
  }

  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((relativePath) => fileNameRegex.test(path.basename(relativePath)))
    .map((relativePath) => path.join(dir, relativePath))
    .sort()
}

/**
 * Reads a schema file the way `vtex content generate-schema` accepts it.
 * A leading UTF-8 BOM is rejected rather than stripped: the toolbelt treats
 * such a file as malformed and ignores it, so accepting it here would
 * reference a component or content-type that never reaches the schema.
 * `displayPath` is the path reported in errors.
 */
function readSchemaFile(filePath: string, displayPath = filePath): unknown {
  const content = readFileSync(filePath, 'utf8')

  if (content.charCodeAt(0) === 0xfeff) {
    throw new Error(
      `${displayPath} starts with a UTF-8 BOM, which vtex content generate-schema treats as malformed. Save it as UTF-8 without BOM to apply contentSource.disabledSections.`
    )
  }

  try {
    return parseJsonc(content)
  } catch (error) {
    throw new Error(
      `Could not parse ${displayPath} while applying contentSource.disabledSections: ${error instanceof Error ? error.message : error}`
    )
  }
}

/**
 * Parses JSONC (JSON with comments and trailing commas), the format accepted
 * by `vtex content generate-schema`. Throws on invalid input.
 */
export function parseJsonc(content: string): unknown {
  let json = ''
  let inString = false
  let pendingComma = false

  for (let i = 0; i < content.length; i++) {
    const char = content[i]

    if (inString) {
      json += char
      if (char === '\\') {
        json += content[++i] ?? ''
      } else if (char === '"') {
        inString = false
      }
      continue
    }

    if (char === '/' && content[i + 1] === '/') {
      while (i + 1 < content.length && content[i + 1] !== '\n') i++
      continue
    }

    if (char === '/' && content[i + 1] === '*') {
      const end = content.indexOf('*/', i + 2)
      i = end === -1 ? content.length : end + 1
      continue
    }

    if (/\s/.test(char)) {
      json += char
      continue
    }

    // A comma is only emitted once we know it is not a trailing one.
    if (pendingComma && char !== '}' && char !== ']') {
      json += ','
    }

    pendingComma = char === ','
    if (pendingComma) {
      continue
    }

    if (char === '"') {
      inString = true
    }

    json += char
  }

  return JSON.parse(pendingComma ? `${json},` : json)
}

/**
 * Removes the temporary CP merge directory. Safe to call on any outcome
 * (success, dry-run, or failure).
 */
export function cleanupCpMergeDir(mergeDir: string): void {
  rmSync(mergeDir, { recursive: true, force: true })
}

export function generateAndUploadSchema({
  basePath,
  dirs,
  schemaOut,
  dryRun,
  project,
}: {
  basePath: string
  dirs: string[]
  schemaOut: string
  dryRun: boolean
  /**
   * The store's `contentSource.project`, forwarded as `--storeId` to
   * `vtex content upload-schema` so the published schema's `$id`
   * (`${account}.${storeId}`) matches the project declared in
   * `discovery.config.js`, mirroring the legacy CMS flow's use of `project`
   * in `vtex cms sync ${project}`. Falls back to `'faststore'`, the same
   * default already used there.
   */
  project?: string
}): void {
  // Interactive: generate-schema prompts to confirm overriding base
  // definitions (no --yes flag), and upload-schema prompts for the schema
  // version to publish. stdio must reach the user's TTY.
  runCommandSync({
    cmd: `vtex content generate-schema ${dirs.join(' ')} -o ${schemaOut}`,
    cwd: basePath,
    throws: 'error',
    errorMessage: 'Failed to generate CMS schema',
    interactive: true,
  })

  if (dryRun) {
    return
  }

  const storeId = project ?? 'faststore'

  runCommandSync({
    cmd: `vtex content upload-schema ${schemaOut} --storeId ${storeId}`,
    cwd: basePath,
    throws: 'error',
    errorMessage: 'Failed to upload CMS schema',
    interactive: true,
  })
}
