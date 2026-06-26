import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { withBasePath } from '../utils/directory'

const spawnMock = vi.hoisted(() => vi.fn())
const generateMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))
const mergeCMSFilesMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))
const getExistingCpDirsMock = vi.hoisted(() => vi.fn())
const errorNoCustomizationMock = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error('errorNoCustomization')
  })
)
const generateAndUploadSchemaMock = vi.hoisted(() => vi.fn())
const getCpSchemaOutputPathMock = vi.hoisted(() => vi.fn())
const prepareMyAccountMergeDirMock = vi.hoisted(() => vi.fn())
const cleanupMyAccountMergeDirMock = vi.hoisted(() => vi.fn())
const assertVtexReadyForAccountMock = vi.hoisted(() => vi.fn())

vi.mock('node:child_process', () => ({
  spawn: (...args: unknown[]) => spawnMock(...args),
}))

vi.mock('../utils/generate', () => ({
  generate: (...args: unknown[]) => generateMock(...args),
}))

vi.mock('../utils/hcms', () => ({
  mergeCMSFiles: (...args: unknown[]) => mergeCMSFilesMock(...args),
}))

vi.mock('../utils/cp-schema', () => ({
  getExistingCpDirs: (...args: unknown[]) => getExistingCpDirsMock(...args),
  errorNoCustomization: () => errorNoCustomizationMock(),
  generateAndUploadSchema: (...args: unknown[]) =>
    generateAndUploadSchemaMock(...args),
  getCpSchemaOutputPath: (...args: unknown[]) =>
    getCpSchemaOutputPathMock(...args),
  prepareMyAccountMergeDir: (...args: unknown[]) =>
    prepareMyAccountMergeDirMock(...args),
  cleanupMyAccountMergeDir: (...args: unknown[]) =>
    cleanupMyAccountMergeDirMock(...args),
}))

vi.mock('../utils/vtex', () => ({
  assertVtexReadyForAccount: (...args: unknown[]) =>
    assertVtexReadyForAccountMock(...args),
}))

import CmsSync from './cms-sync'
import { logger } from '../utils/logger'

function writeDiscoveryConfig(
  storeDir: string,
  config: Record<string, unknown> = {}
) {
  fs.writeFileSync(
    path.join(storeDir, 'discovery.config.js'),
    `module.exports = ${JSON.stringify(config, null, 2)}`
  )
}

async function runCmsSync(options?: {
  storeDir?: string
  dryRun?: boolean
}) {
  const storeDir = options?.storeDir ?? process.cwd()
  const command = new CmsSync([], {} as never)

  vi.spyOn(command, 'parse').mockResolvedValue({
    flags: { 'dry-run': options?.dryRun ?? false },
    args: { path: storeDir },
  } as never)

  await command.run()
}

describe('CmsSync', () => {
  let tempDir: string
  let originalCwd: string
  let infoMock: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'faststore-cms-sync-'))
    originalCwd = process.cwd()
    process.chdir(tempDir)

    vi.clearAllMocks()
    infoMock = vi.spyOn(logger, 'info').mockImplementation(() => {})
    getCpSchemaOutputPathMock.mockImplementation((basePath: string) =>
      path.join(withBasePath(basePath).userCMSDir, 'schema.json')
    )
  })

  afterEach(() => {
    process.chdir(originalCwd)
    fs.rmSync(tempDir, { recursive: true, force: true })
    infoMock.mockRestore()
  })

  describe('legacy CMS branch', () => {
    it('runs vtex cms sync faststore when config is missing (matrix #1)', async () => {
      await runCmsSync({ storeDir: tempDir })

      expect(generateMock).toHaveBeenCalledWith({
        setup: true,
        basePath: tempDir,
      })
      expect(mergeCMSFilesMock).toHaveBeenCalledWith(tempDir)
      expect(spawnMock).toHaveBeenCalledWith('vtex cms sync faststore', {
        shell: true,
        cwd: path.join(tempDir, '.faststore'),
        stdio: 'inherit',
      })
      expect(infoMock).toHaveBeenCalledWith(
        expect.stringContaining('Detected contentSource "CMS"')
      )
      expect(infoMock).toHaveBeenCalledWith(
        expect.stringContaining('merging and syncing CMS content')
      )
    })

    it('uses contentSource.project from config (matrix #2)', async () => {
      writeDiscoveryConfig(tempDir, {
        contentSource: { type: 'CMS', project: 'myproj' },
      })

      await runCmsSync({ storeDir: tempDir })

      expect(spawnMock).toHaveBeenCalledWith('vtex cms sync myproj', {
        shell: true,
        cwd: path.join(tempDir, '.faststore'),
        stdio: 'inherit',
      })
    })

    it('skips vtex cms sync on --dry-run (matrix #3)', async () => {
      writeDiscoveryConfig(tempDir, {
        contentSource: { type: 'CMS' },
      })

      await runCmsSync({ storeDir: tempDir, dryRun: true })

      expect(generateMock).toHaveBeenCalled()
      expect(mergeCMSFilesMock).toHaveBeenCalled()
      expect(spawnMock).not.toHaveBeenCalled()
    })
  })

  describe('CP branch', () => {
    beforeEach(() => {
      writeDiscoveryConfig(tempDir, {
        contentSource: { type: 'CP' },
      })
    })

    it('generates and uploads schema when both dirs exist (matrix #4)', async () => {
      getExistingCpDirsMock.mockReturnValue([
        'cms/faststore/components',
        'cms/faststore/pages',
      ])

      await runCmsSync({ storeDir: tempDir })

      expect(generateAndUploadSchemaMock).toHaveBeenCalledWith({
        basePath: tempDir,
        dirs: ['cms/faststore/components', 'cms/faststore/pages'],
        schemaOut: path.join(tempDir, 'cms/faststore/schema.json'),
        dryRun: false,
      })
      expect(infoMock).toHaveBeenCalledWith(
        expect.stringContaining('Detected contentSource "CP"')
      )
      expect(infoMock).toHaveBeenCalledWith(
        expect.stringContaining('generating and uploading schema')
      )
    })

    it('uses components dir only (matrix #5)', async () => {
      getExistingCpDirsMock.mockReturnValue(['cms/faststore/components'])

      await runCmsSync({ storeDir: tempDir })

      expect(generateAndUploadSchemaMock).toHaveBeenCalledWith(
        expect.objectContaining({
          dirs: ['cms/faststore/components'],
        })
      )
    })

    it('uses pages dir only (matrix #6)', async () => {
      getExistingCpDirsMock.mockReturnValue(['cms/faststore/pages'])

      await runCmsSync({ storeDir: tempDir })

      expect(generateAndUploadSchemaMock).toHaveBeenCalledWith(
        expect.objectContaining({
          dirs: ['cms/faststore/pages'],
        })
      )
    })

    it('calls errorNoCustomization when no dirs exist (matrix #7)', async () => {
      getExistingCpDirsMock.mockReturnValue([])

      await expect(runCmsSync({ storeDir: tempDir })).rejects.toThrow(
        'errorNoCustomization'
      )

      expect(errorNoCustomizationMock).toHaveBeenCalled()
      expect(generateAndUploadSchemaMock).not.toHaveBeenCalled()
    })

    it('passes dryRun to generateAndUploadSchema (matrix #8)', async () => {
      getExistingCpDirsMock.mockReturnValue(['cms/faststore/components'])

      await runCmsSync({ storeDir: tempDir, dryRun: true })

      expect(generateAndUploadSchemaMock).toHaveBeenCalledWith(
        expect.objectContaining({
          dryRun: true,
        })
      )
    })

    it('detects CP from lowercase contentSource.type', async () => {
      writeDiscoveryConfig(tempDir, {
        contentSource: { type: 'cp' },
      })
      getExistingCpDirsMock.mockReturnValue(['cms/faststore/components'])

      await runCmsSync({ storeDir: tempDir })

      expect(infoMock).toHaveBeenCalledWith(
        expect.stringContaining('Detected contentSource "CP"')
      )
    })

    it('runs the vtex preflight with the store account before generating', async () => {
      writeDiscoveryConfig(tempDir, {
        api: { storeId: 'brandless' },
        contentSource: { type: 'CP' },
      })
      getExistingCpDirsMock.mockReturnValue(['cms/faststore/components'])

      await runCmsSync({ storeDir: tempDir })

      expect(assertVtexReadyForAccountMock).toHaveBeenCalledWith('brandless')
    })
  })

  describe('CP branch with My Account', () => {
    const mergeDir = '/tmp/faststore-cms-myaccount-xyz'
    const mergedDirs = [`${mergeDir}/components`, `${mergeDir}/pages`]

    beforeEach(() => {
      prepareMyAccountMergeDirMock.mockReturnValue({
        mergeDir,
        dirs: mergedDirs,
      })
    })

    it('appends merged My Account dirs and announces the merge (matrix #10)', async () => {
      writeDiscoveryConfig(tempDir, {
        contentSource: { type: 'CP' },
        experimental: { enableFaststoreMyAccount: true },
      })
      getExistingCpDirsMock.mockReturnValue([
        'cms/faststore/components',
        'cms/faststore/pages',
      ])

      await runCmsSync({ storeDir: tempDir })

      expect(prepareMyAccountMergeDirMock).toHaveBeenCalledWith(tempDir)
      expect(infoMock).toHaveBeenCalledWith(
        expect.stringContaining('Merging My Account')
      )
      expect(generateAndUploadSchemaMock).toHaveBeenCalledWith({
        basePath: tempDir,
        dirs: [
          'cms/faststore/components',
          'cms/faststore/pages',
          ...mergedDirs,
        ],
        schemaOut: path.join(tempDir, 'cms/faststore/schema.json'),
        dryRun: false,
      })
      expect(errorNoCustomizationMock).not.toHaveBeenCalled()
      expect(cleanupMyAccountMergeDirMock).toHaveBeenCalledWith(mergeDir)
    })

    it('proceeds with only My Account dirs when the store has none (matrix #11)', async () => {
      writeDiscoveryConfig(tempDir, {
        contentSource: { type: 'CP' },
        experimental: { enableFaststoreMyAccount: true },
      })
      getExistingCpDirsMock.mockReturnValue([])

      await runCmsSync({ storeDir: tempDir })

      expect(errorNoCustomizationMock).not.toHaveBeenCalled()
      expect(generateAndUploadSchemaMock).toHaveBeenCalledWith(
        expect.objectContaining({ dirs: mergedDirs })
      )
      expect(cleanupMyAccountMergeDirMock).toHaveBeenCalledWith(mergeDir)
    })

    it('does not include My Account when the flag is off (matrix #12)', async () => {
      writeDiscoveryConfig(tempDir, {
        contentSource: { type: 'CP' },
        experimental: { enableFaststoreMyAccount: false },
      })
      getExistingCpDirsMock.mockReturnValue([
        'cms/faststore/components',
        'cms/faststore/pages',
      ])

      await runCmsSync({ storeDir: tempDir })

      expect(prepareMyAccountMergeDirMock).not.toHaveBeenCalled()
      expect(cleanupMyAccountMergeDirMock).not.toHaveBeenCalled()
      expect(generateAndUploadSchemaMock).toHaveBeenCalledWith(
        expect.objectContaining({
          dirs: ['cms/faststore/components', 'cms/faststore/pages'],
        })
      )
    })

    it('cleans up the merge dir on --dry-run (matrix #13)', async () => {
      writeDiscoveryConfig(tempDir, {
        contentSource: { type: 'CP' },
        experimental: { enableFaststoreMyAccount: true },
      })
      getExistingCpDirsMock.mockReturnValue(['cms/faststore/components'])

      await runCmsSync({ storeDir: tempDir, dryRun: true })

      expect(generateAndUploadSchemaMock).toHaveBeenCalledWith(
        expect.objectContaining({ dryRun: true })
      )
      expect(cleanupMyAccountMergeDirMock).toHaveBeenCalledWith(mergeDir)
    })

    it('does not generate when core My Account schemas are missing (matrix #14)', async () => {
      writeDiscoveryConfig(tempDir, {
        contentSource: { type: 'CP' },
        experimental: { enableFaststoreMyAccount: true },
      })
      getExistingCpDirsMock.mockReturnValue(['cms/faststore/components'])
      prepareMyAccountMergeDirMock.mockImplementation(() => {
        throw new Error('prepareMyAccountMergeDir exited')
      })

      await expect(runCmsSync({ storeDir: tempDir })).rejects.toThrow(
        'prepareMyAccountMergeDir exited'
      )

      expect(generateAndUploadSchemaMock).not.toHaveBeenCalled()
      expect(cleanupMyAccountMergeDirMock).not.toHaveBeenCalled()
    })
  })
})
