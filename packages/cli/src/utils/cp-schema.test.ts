import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const runCommandSyncMock = vi.hoisted(() => vi.fn())
const coreCMSDirMock = vi.hoisted(() => vi.fn<[], string>())

vi.mock('./runCommandSync', () => ({
  runCommandSync: (...args: unknown[]) => runCommandSyncMock(...args),
}))

vi.mock('./directory', async () => {
  const nodePath = await import('node:path')

  return {
    withBasePath: (basePath: string) => ({
      userCMSDir: nodePath.join(basePath, 'cms', 'faststore'),
      coreCMSDir: coreCMSDirMock(),
      tmpDir: nodePath.join(basePath, '.faststore'),
    }),
  }
})

import {
  cleanupMyAccountMergeDir,
  errorNoCustomization,
  generateAndUploadSchema,
  getCpSchemaOutputPath,
  getExistingCpDirs,
  prepareMyAccountMergeDir,
} from './cp-schema'
import { logger } from './logger'

describe('cp-schema', () => {
  let tempDir: string
  let exitMock: ReturnType<typeof vi.spyOn>
  let errorMock: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'faststore-cp-schema-'))
    runCommandSyncMock.mockClear()
    coreCMSDirMock.mockReset()
    coreCMSDirMock.mockReturnValue(
      path.join(tempDir, 'core', 'cms', 'faststore')
    )
    exitMock = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never)
    errorMock = vi.spyOn(logger, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true })
    exitMock.mockRestore()
    errorMock.mockRestore()
  })

  describe('getExistingCpDirs', () => {
    it('returns relative paths for existing customization dirs', () => {
      fs.mkdirSync(path.join(tempDir, 'cms', 'faststore', 'components'), {
        recursive: true,
      })

      expect(getExistingCpDirs(tempDir)).toEqual(['cms/faststore/components'])
    })

    it('returns both dirs when both exist', () => {
      fs.mkdirSync(path.join(tempDir, 'cms', 'faststore', 'components'), {
        recursive: true,
      })
      fs.mkdirSync(path.join(tempDir, 'cms', 'faststore', 'pages'), {
        recursive: true,
      })

      expect(getExistingCpDirs(tempDir)).toEqual([
        'cms/faststore/components',
        'cms/faststore/pages',
      ])
    })

    it('returns empty array when neither dir exists', () => {
      expect(getExistingCpDirs(tempDir)).toEqual([])
    })
  })

  describe('getCpSchemaOutputPath', () => {
    it('returns a path relative to the store root', () => {
      expect(getCpSchemaOutputPath(tempDir)).toBe(
        path.join('cms', 'faststore', 'schema.json')
      )
    })
  })

  describe('errorNoCustomization', () => {
    it('logs and exits with code 1', () => {
      errorNoCustomization()

      expect(errorMock).toHaveBeenCalledWith(
        expect.stringContaining('No CMS customization found')
      )
      expect(exitMock).toHaveBeenCalledWith(1)
    })
  })

  describe('generateAndUploadSchema', () => {
    it('runs generate then upload synchronously without -l', () => {
      const schemaOut = path.join(tempDir, 'cms', 'faststore', 'schema.json')

      generateAndUploadSchema({
        basePath: tempDir,
        dirs: ['cms/faststore/components', 'cms/faststore/pages'],
        schemaOut,
        dryRun: false,
      })

      expect(runCommandSyncMock).toHaveBeenCalledTimes(2)
      expect(runCommandSyncMock.mock.calls[0][0]).toEqual({
        cmd: `vtex content generate-schema cms/faststore/components cms/faststore/pages -o ${schemaOut}`,
        cwd: tempDir,
        throws: 'error',
        errorMessage: 'Failed to generate CMS schema',
        interactive: true,
      })
      expect(runCommandSyncMock.mock.calls[1][0]).toEqual({
        cmd: `vtex content upload-schema ${schemaOut}`,
        cwd: tempDir,
        throws: 'error',
        errorMessage: 'Failed to upload CMS schema',
        interactive: true,
      })
      expect(runCommandSyncMock.mock.calls[0][0].cmd).not.toContain('-l')
    })

    it('skips upload on dry-run', () => {
      generateAndUploadSchema({
        basePath: tempDir,
        dirs: ['cms/faststore/pages'],
        schemaOut: path.join(tempDir, 'cms', 'faststore', 'schema.json'),
        dryRun: true,
      })

      expect(runCommandSyncMock).toHaveBeenCalledTimes(1)
      expect(runCommandSyncMock.mock.calls[0][0].cmd).toContain(
        'generate-schema'
      )
    })
  })

  describe('prepareMyAccountMergeDir', () => {
    function seedCoreMyAccount() {
      const coreDir = path.join(tempDir, 'core', 'cms', 'faststore')
      const componentsDir = path.join(coreDir, 'my-account', 'components')
      const pagesDir = path.join(coreDir, 'my-account', 'pages')
      fs.mkdirSync(componentsDir, { recursive: true })
      fs.mkdirSync(pagesDir, { recursive: true })
      fs.writeFileSync(path.join(componentsDir, 'cms_component__x.jsonc'), '{}')
      fs.writeFileSync(path.join(pagesDir, 'cms_content_type__y.jsonc'), '{}')
      coreCMSDirMock.mockReturnValue(coreDir)
    }

    function seedStoreCustomizations() {
      const storeComponents = path.join(
        tempDir,
        'cms',
        'faststore',
        'components'
      )
      const storePages = path.join(tempDir, 'cms', 'faststore', 'pages')
      fs.mkdirSync(storeComponents, { recursive: true })
      fs.mkdirSync(storePages, { recursive: true })
      fs.writeFileSync(
        path.join(storeComponents, 'cms_component__store.jsonc'),
        '{}'
      )
      fs.writeFileSync(
        path.join(storePages, 'cms_content_type__store.jsonc'),
        '{}'
      )
    }

    it('merges core My Account components/pages into two staging dirs', () => {
      seedCoreMyAccount()

      const { mergeDir, dirs } = prepareMyAccountMergeDir(tempDir)

      try {
        // Staging lives inside the store's .faststore and paths are relative.
        expect(mergeDir.startsWith(path.join(tempDir, '.faststore'))).toBe(true)
        expect(dirs).toEqual([
          path.relative(tempDir, path.join(mergeDir, 'components')),
          path.relative(tempDir, path.join(mergeDir, 'pages')),
        ])
        expect(
          fs.existsSync(
            path.join(mergeDir, 'components', 'cms_component__x.jsonc')
          )
        ).toBe(true)
        expect(
          fs.existsSync(
            path.join(mergeDir, 'pages', 'cms_content_type__y.jsonc')
          )
        ).toBe(true)
        expect(exitMock).not.toHaveBeenCalled()
      } finally {
        fs.rmSync(mergeDir, { recursive: true, force: true })
      }
    })

    it('merges the store customizations alongside the core My Account schemas', () => {
      seedCoreMyAccount()
      seedStoreCustomizations()

      const { mergeDir } = prepareMyAccountMergeDir(tempDir)

      try {
        // Core My Account files present.
        expect(
          fs.existsSync(
            path.join(mergeDir, 'components', 'cms_component__x.jsonc')
          )
        ).toBe(true)
        // Store customizations present in the same staging dir.
        expect(
          fs.existsSync(
            path.join(mergeDir, 'components', 'cms_component__store.jsonc')
          )
        ).toBe(true)
        expect(
          fs.existsSync(
            path.join(mergeDir, 'pages', 'cms_content_type__store.jsonc')
          )
        ).toBe(true)
      } finally {
        fs.rmSync(mergeDir, { recursive: true, force: true })
      }
    })

    it('lets the store override a core My Account file on collision', () => {
      const coreDir = path.join(tempDir, 'core', 'cms', 'faststore')
      const coreComponents = path.join(coreDir, 'my-account', 'components')
      fs.mkdirSync(coreComponents, { recursive: true })
      fs.writeFileSync(
        path.join(coreComponents, 'cms_component__shared.jsonc'),
        '{"owner":"core"}'
      )
      fs.mkdirSync(path.join(coreDir, 'my-account', 'pages'), {
        recursive: true,
      })
      coreCMSDirMock.mockReturnValue(coreDir)

      const storeComponents = path.join(
        tempDir,
        'cms',
        'faststore',
        'components'
      )
      fs.mkdirSync(storeComponents, { recursive: true })
      fs.writeFileSync(
        path.join(storeComponents, 'cms_component__shared.jsonc'),
        '{"owner":"store"}'
      )

      const { mergeDir } = prepareMyAccountMergeDir(tempDir)

      try {
        expect(
          fs
            .readFileSync(
              path.join(mergeDir, 'components', 'cms_component__shared.jsonc'),
              'utf-8'
            )
            .toString()
        ).toContain('store')
      } finally {
        fs.rmSync(mergeDir, { recursive: true, force: true })
      }
    })

    it('errors and exits when core My Account schemas are missing', () => {
      coreCMSDirMock.mockReturnValue(
        path.join(tempDir, 'core-without-myaccount')
      )

      const result = prepareMyAccountMergeDir(tempDir)

      expect(errorMock).toHaveBeenCalledWith(
        expect.stringContaining(
          'My Account is enabled but the core My Account schemas were not found'
        )
      )
      expect(exitMock).toHaveBeenCalledWith(1)

      // process.exit is mocked to a noop in tests, so the function continues and
      // may create an empty temp dir — clean it up to avoid leaking.
      if (result?.mergeDir) {
        fs.rmSync(result.mergeDir, { recursive: true, force: true })
      }
    })
  })

  describe('cleanupMyAccountMergeDir', () => {
    it('removes the merge directory', () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'faststore-cleanup-'))
      fs.writeFileSync(path.join(dir, 'a.txt'), 'x')

      cleanupMyAccountMergeDir(dir)

      expect(fs.existsSync(dir)).toBe(false)
    })

    it('does not throw when the directory is already gone', () => {
      const dir = path.join(tempDir, 'nonexistent')

      expect(() => cleanupMyAccountMergeDir(dir)).not.toThrow()
    })
  })
})
