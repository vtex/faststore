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
      getPackagePath: (...packagePath: string[]) =>
        nodePath.join(basePath, 'node_modules', ...packagePath),
    }),
  }
})

import {
  cleanupCpMergeDir,
  errorNoCustomization,
  generateAndUploadSchema,
  getCpSchemaOutputPath,
  getExistingCpDirs,
  hasPluginCpSchema,
  prepareCpMergeDir,
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

      expect(getExistingCpDirs(tempDir)).toEqual([
        path.join('cms', 'faststore', 'components'),
      ])
    })

    it('returns both dirs when both exist', () => {
      fs.mkdirSync(path.join(tempDir, 'cms', 'faststore', 'components'), {
        recursive: true,
      })
      fs.mkdirSync(path.join(tempDir, 'cms', 'faststore', 'pages'), {
        recursive: true,
      })

      expect(getExistingCpDirs(tempDir)).toEqual([
        path.join('cms', 'faststore', 'components'),
        path.join('cms', 'faststore', 'pages'),
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
    it('runs generate then upload synchronously without -l, forwarding the project as --storeId', () => {
      const schemaOut = path.join(tempDir, 'cms', 'faststore', 'schema.json')

      generateAndUploadSchema({
        basePath: tempDir,
        dirs: ['cms/faststore/components', 'cms/faststore/pages'],
        schemaOut,
        dryRun: false,
        project: 'my-store',
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
        cmd: `vtex content upload-schema ${schemaOut} --storeId my-store`,
        cwd: tempDir,
        throws: 'error',
        errorMessage: 'Failed to upload CMS schema',
        interactive: true,
      })
    })

    it('falls back to the "faststore" storeId when no project is configured', () => {
      const schemaOut = path.join(tempDir, 'cms', 'faststore', 'schema.json')

      generateAndUploadSchema({
        basePath: tempDir,
        dirs: ['cms/faststore/components', 'cms/faststore/pages'],
        schemaOut,
        dryRun: false,
      })

      expect(runCommandSyncMock.mock.calls[1][0].cmd).toBe(
        `vtex content upload-schema ${schemaOut} --storeId faststore`
      )
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

  describe('prepareCpMergeDir with My Account', () => {
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

      const { mergeDir, dirs } = prepareCpMergeDir({
        basePath: tempDir,
        includeMyAccount: true,
        plugins: [],
      })

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

      const { mergeDir } = prepareCpMergeDir({
        basePath: tempDir,
        includeMyAccount: true,
        plugins: [],
      })

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

      const { mergeDir } = prepareCpMergeDir({
        basePath: tempDir,
        includeMyAccount: true,
        plugins: [],
      })

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

    it('removes the staging dir and rethrows when a copy fails midway', () => {
      // core/my-account exists (so the guard passes), but `components` is a FILE.
      // cpSync(file → staging dir) throws, so the copy fails after the staging
      // dir was created — exercising the self-cleanup path.
      const coreDir = path.join(tempDir, 'core', 'cms', 'faststore')
      const myAccount = path.join(coreDir, 'my-account')
      fs.mkdirSync(myAccount, { recursive: true })
      fs.writeFileSync(path.join(myAccount, 'components'), 'not a dir')
      coreCMSDirMock.mockReturnValue(coreDir)

      expect(() =>
        prepareCpMergeDir({
          basePath: tempDir,
          includeMyAccount: true,
          plugins: [],
        })
      ).toThrow()

      // The staging dir was created under .faststore then removed on failure.
      const stagingParent = path.join(tempDir, '.faststore')
      const leftovers = fs.existsSync(stagingParent)
        ? fs
            .readdirSync(stagingParent)
            .filter((name) => name.startsWith('cms-merge-'))
        : []
      expect(leftovers).toEqual([])
    })

    it('errors and exits when core My Account schemas are missing', () => {
      coreCMSDirMock.mockReturnValue(
        path.join(tempDir, 'core-without-myaccount')
      )

      const result = prepareCpMergeDir({
        basePath: tempDir,
        includeMyAccount: true,
        plugins: [],
      })

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

  describe('plugin schemas', () => {
    const PLUGIN_A = '@vtex/plugin-a'
    const PLUGIN_B = '@vtex/plugin-b'

    function seedPluginFile(
      plugin: string,
      subdir: 'components' | 'pages',
      fileName: string,
      content: string
    ) {
      const dir = path.join(
        tempDir,
        'node_modules',
        plugin,
        'cms',
        'faststore',
        subdir
      )
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, fileName), content)
    }

    function seedStoreFile(
      subdir: 'components' | 'pages',
      fileName: string,
      content: string
    ) {
      const dir = path.join(tempDir, 'cms', 'faststore', subdir)
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, fileName), content)
    }

    function readStaged(
      mergeDir: string,
      subdir: 'components' | 'pages',
      fileName: string
    ) {
      return fs.readFileSync(path.join(mergeDir, subdir, fileName), 'utf-8')
    }

    describe('hasPluginCpSchema', () => {
      it('is true when a plugin ships a components or pages directory', () => {
        seedPluginFile(PLUGIN_A, 'pages', 'cms_content_type__a.jsonc', '{}')

        expect(hasPluginCpSchema(tempDir, [PLUGIN_A])).toBe(true)
      })

      it('is false when the plugin has no cms/faststore directory', () => {
        fs.mkdirSync(path.join(tempDir, 'node_modules', PLUGIN_A), {
          recursive: true,
        })

        expect(hasPluginCpSchema(tempDir, [PLUGIN_A])).toBe(false)
      })

      it('is false when there are no plugins', () => {
        expect(hasPluginCpSchema(tempDir, [])).toBe(false)
      })

      it('resolves the object form of a plugin entry', () => {
        seedPluginFile(PLUGIN_A, 'components', 'cms_component__a.jsonc', '{}')

        expect(hasPluginCpSchema(tempDir, [{ [PLUGIN_A]: {} }])).toBe(true)
      })
    })

    describe('prepareCpMergeDir', () => {
      it('stages plugin components and pages next to the store files', () => {
        seedPluginFile(PLUGIN_A, 'components', 'cms_component__a.jsonc', '{}')
        seedPluginFile(PLUGIN_A, 'pages', 'cms_content_type__a.jsonc', '{}')
        seedStoreFile('components', 'cms_component__store.jsonc', '{}')

        const { mergeDir, dirs } = prepareCpMergeDir({
          basePath: tempDir,
          includeMyAccount: false,
          plugins: [PLUGIN_A],
        })

        try {
          expect(dirs).toEqual([
            path.relative(tempDir, path.join(mergeDir, 'components')),
            path.relative(tempDir, path.join(mergeDir, 'pages')),
          ])
          expect(
            fs.existsSync(
              path.join(mergeDir, 'components', 'cms_component__a.jsonc')
            )
          ).toBe(true)
          expect(
            fs.existsSync(
              path.join(mergeDir, 'pages', 'cms_content_type__a.jsonc')
            )
          ).toBe(true)
          expect(
            fs.existsSync(
              path.join(mergeDir, 'components', 'cms_component__store.jsonc')
            )
          ).toBe(true)
        } finally {
          fs.rmSync(mergeDir, { recursive: true, force: true })
        }
      })

      it('lets the store override a plugin file with the same name', () => {
        seedPluginFile(
          PLUGIN_A,
          'components',
          'shared.jsonc',
          '{"owner":"plugin"}'
        )
        seedStoreFile('components', 'shared.jsonc', '{"owner":"store"}')

        const { mergeDir } = prepareCpMergeDir({
          basePath: tempDir,
          includeMyAccount: false,
          plugins: [PLUGIN_A],
        })

        try {
          expect(readStaged(mergeDir, 'components', 'shared.jsonc')).toContain(
            'store'
          )
        } finally {
          fs.rmSync(mergeDir, { recursive: true, force: true })
        }
      })

      it('lets a later plugin override an earlier one and warns naming both', () => {
        const warnMock = vi.spyOn(logger, 'warn').mockImplementation(() => {})
        seedPluginFile(PLUGIN_A, 'components', 'shared.jsonc', '{"owner":"a"}')
        seedPluginFile(PLUGIN_B, 'components', 'shared.jsonc', '{"owner":"b"}')

        const { mergeDir } = prepareCpMergeDir({
          basePath: tempDir,
          includeMyAccount: false,
          plugins: [PLUGIN_A, PLUGIN_B],
        })

        try {
          expect(readStaged(mergeDir, 'components', 'shared.jsonc')).toContain(
            '"b"'
          )
          expect(warnMock).toHaveBeenCalledWith(
            expect.stringContaining(PLUGIN_A)
          )
          expect(warnMock).toHaveBeenCalledWith(
            expect.stringContaining(PLUGIN_B)
          )
        } finally {
          warnMock.mockRestore()
          fs.rmSync(mergeDir, { recursive: true, force: true })
        }
      })

      it('applies precedence store > plugin > core My Account', () => {
        const coreDir = path.join(tempDir, 'core', 'cms', 'faststore')
        const coreComponents = path.join(coreDir, 'my-account', 'components')
        fs.mkdirSync(coreComponents, { recursive: true })
        fs.mkdirSync(path.join(coreDir, 'my-account', 'pages'), {
          recursive: true,
        })
        fs.writeFileSync(
          path.join(coreComponents, 'a.jsonc'),
          '{"owner":"core"}'
        )
        fs.writeFileSync(
          path.join(coreComponents, 'b.jsonc'),
          '{"owner":"core"}'
        )
        coreCMSDirMock.mockReturnValue(coreDir)
        seedPluginFile(PLUGIN_A, 'components', 'a.jsonc', '{"owner":"plugin"}')
        seedPluginFile(PLUGIN_A, 'components', 'b.jsonc', '{"owner":"plugin"}')
        seedStoreFile('components', 'b.jsonc', '{"owner":"store"}')

        const { mergeDir } = prepareCpMergeDir({
          basePath: tempDir,
          includeMyAccount: true,
          plugins: [PLUGIN_A],
        })

        try {
          expect(readStaged(mergeDir, 'components', 'a.jsonc')).toContain(
            'plugin'
          )
          expect(readStaged(mergeDir, 'components', 'b.jsonc')).toContain(
            'store'
          )
        } finally {
          fs.rmSync(mergeDir, { recursive: true, force: true })
        }
      })

      it('ignores a plugin without a cms/faststore directory', () => {
        fs.mkdirSync(path.join(tempDir, 'node_modules', PLUGIN_A), {
          recursive: true,
        })
        seedStoreFile('components', 'cms_component__store.jsonc', '{}')

        const { mergeDir } = prepareCpMergeDir({
          basePath: tempDir,
          includeMyAccount: false,
          plugins: [PLUGIN_A],
        })

        try {
          expect(fs.readdirSync(path.join(mergeDir, 'components'))).toEqual([
            'cms_component__store.jsonc',
          ])
        } finally {
          fs.rmSync(mergeDir, { recursive: true, force: true })
        }
      })

      it('works when the store has no cms/faststore directory', () => {
        seedPluginFile(PLUGIN_A, 'pages', 'cms_content_type__a.jsonc', '{}')

        const { mergeDir } = prepareCpMergeDir({
          basePath: tempDir,
          includeMyAccount: false,
          plugins: [PLUGIN_A],
        })

        try {
          expect(
            fs.existsSync(
              path.join(mergeDir, 'pages', 'cms_content_type__a.jsonc')
            )
          ).toBe(true)
          expect(exitMock).not.toHaveBeenCalled()
        } finally {
          fs.rmSync(mergeDir, { recursive: true, force: true })
        }
      })

      it('removes the staging dir and rethrows when a plugin copy fails', () => {
        const pluginCms = path.join(
          tempDir,
          'node_modules',
          PLUGIN_A,
          'cms',
          'faststore'
        )
        fs.mkdirSync(pluginCms, { recursive: true })
        fs.writeFileSync(path.join(pluginCms, 'components'), 'not a dir')

        let thrown: unknown
        try {
          prepareCpMergeDir({
            basePath: tempDir,
            includeMyAccount: false,
            plugins: [PLUGIN_A],
          })
        } catch (error) {
          thrown = error
        }

        // A copy failure, not a missing function (TypeError).
        expect(thrown).toBeInstanceOf(Error)
        expect(thrown).not.toBeInstanceOf(TypeError)

        const stagingParent = path.join(tempDir, '.faststore')
        const leftovers = fs.existsSync(stagingParent)
          ? fs
              .readdirSync(stagingParent)
              .filter((name) => name.startsWith('cms-merge-'))
          : []
        expect(leftovers).toEqual([])
      })
    })
  })

  describe('cleanupCpMergeDir', () => {
    it('removes the merge directory', () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'faststore-cleanup-'))
      fs.writeFileSync(path.join(dir, 'a.txt'), 'x')

      cleanupCpMergeDir(dir)

      expect(fs.existsSync(dir)).toBe(false)
    })

    it('does not throw when the directory is already gone', () => {
      const dir = path.join(tempDir, 'nonexistent')

      expect(() => cleanupCpMergeDir(dir)).not.toThrow()
    })
  })
})
