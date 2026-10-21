import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockInstance,
  vi,
} from 'vitest'

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
  cleanupCpMergeDir,
  errorNoCustomization,
  generateAndUploadSchema,
  getCpSchemaOutputPath,
  getExistingCpDirs,
  parseJsonc,
  prepareCpMergeDir,
} from './cp-schema'
import { logger } from './logger'

const myAccountOnly = { includeMyAccount: true, disabledSections: [] }

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

      const { mergeDir, dirs } = prepareCpMergeDir(tempDir, myAccountOnly)

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

      const { mergeDir } = prepareCpMergeDir(tempDir, myAccountOnly)

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

      const { mergeDir } = prepareCpMergeDir(tempDir, myAccountOnly)

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

      expect(() => prepareCpMergeDir(tempDir, myAccountOnly)).toThrow()

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

      const result = prepareCpMergeDir(tempDir, myAccountOnly)

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

  describe('prepareCpMergeDir with disabledSections', () => {
    const allowAll = { $ref: '#/$defs/$ALLOW_ALL_COMPONENTS' }

    type StagedContentType = {
      title: string
      properties: { sections: { items: { anyOf: Array<{ $ref: string }> } } }
    }

    function writeSchema(filePath: string, content: unknown) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      fs.writeFileSync(
        filePath,
        typeof content === 'string' ? content : JSON.stringify(content)
      )
    }

    function component(key: string) {
      return { $componentKey: key, title: key, type: 'object' }
    }

    function page(key: string, sections: unknown = allowAll) {
      return { [key]: { title: key, properties: { sections } } }
    }

    function sectionKeys(contentType: StagedContentType) {
      return contentType.properties.sections.items.anyOf.map(({ $ref }) =>
        $ref.replace('#/components/', '')
      )
    }

    function readStaged(mergeDir: string, ...segments: string[]) {
      return JSON.parse(
        fs.readFileSync(path.join(mergeDir, ...segments), 'utf-8')
      )
    }

    let coreDir: string
    let storeDir: string
    let infoSpy: MockInstance<typeof logger.info>
    let warnSpy: MockInstance<typeof logger.warn>

    beforeEach(() => {
      // Same path the outer beforeEach returns from coreCMSDirMock.
      coreDir = path.join(tempDir, 'core', 'cms', 'faststore')
      storeDir = path.join(tempDir, 'cms', 'faststore')

      for (const key of ['Alert', 'Hero', 'Newsletter']) {
        writeSchema(
          path.join(
            coreDir,
            'components',
            `cms_component__${key.toLowerCase()}.jsonc`
          ),
          component(key)
        )
      }
      writeSchema(
        path.join(coreDir, 'pages', 'cms_content_type__home.jsonc'),
        page('home')
      )
      writeSchema(
        path.join(coreDir, 'pages', 'cms_content_type__pdp.jsonc'),
        page('pdp')
      )
      writeSchema(
        path.join(
          coreDir,
          'my-account',
          'components',
          'cms_component__accountprofile.jsonc'
        ),
        component('AccountProfile')
      )
      writeSchema(
        path.join(
          coreDir,
          'my-account',
          'pages',
          'cms_content_type__myaccountprofile.jsonc'
        ),
        page('myAccountProfile')
      )
      // JSONC with comments and trailing commas, as accepted by the toolbelt.
      writeSchema(
        path.join(storeDir, 'components', 'cms_component__storepromo.jsonc'),
        `{
          // Store-only section
          "$componentKey": "StorePromo", /* inline */
          "title": "Store Promo",
        }`
      )

      infoSpy = vi.spyOn(logger, 'info').mockImplementation(() => {})
      warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      infoSpy.mockRestore()
      warnSpy.mockRestore()
    })

    it('overrides the core content-types with every section but the disabled ones', () => {
      const { mergeDir, dirs } = prepareCpMergeDir(tempDir, {
        includeMyAccount: false,
        disabledSections: ['Hero', 'Newsletter'],
      })

      try {
        expect(dirs).toEqual([
          path.relative(tempDir, path.join(mergeDir, 'components')),
          path.relative(tempDir, path.join(mergeDir, 'pages')),
        ])

        for (const key of ['home', 'pdp']) {
          const overrides = readStaged(
            mergeDir,
            'pages',
            'faststore-core',
            `cms_content_type__${key}.jsonc`
          )

          expect(overrides[key].title).toBe(key)
          expect(sectionKeys(overrides[key])).toEqual(['Alert', 'StorePromo'])
        }

        // My Account is not merged when the flag is off.
        expect(
          fs.existsSync(
            path.join(
              mergeDir,
              'pages',
              'cms_content_type__myaccountprofile.jsonc'
            )
          )
        ).toBe(false)
        expect(infoSpy).toHaveBeenCalledWith(
          expect.stringContaining(
            'Hiding disabled sections from the CMS: Hero, Newsletter'
          )
        )
        expect(warnSpy).not.toHaveBeenCalled()
      } finally {
        fs.rmSync(mergeDir, { recursive: true, force: true })
      }
    })

    it('warns about names that match no component', () => {
      const { mergeDir } = prepareCpMergeDir(tempDir, {
        includeMyAccount: false,
        disabledSections: ['Hero', 'Heroo'],
      })

      try {
        expect(warnSpy).toHaveBeenCalledTimes(1)
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('no component with $componentKey "Heroo"')
        )
      } finally {
        fs.rmSync(mergeDir, { recursive: true, force: true })
      }
    })

    it('lets a store content-type override win over the generated core override', () => {
      // The store overrides `home` from a file with a different name.
      writeSchema(
        path.join(storeDir, 'pages', 'cms_content_type__customhome.jsonc'),
        { home: { title: 'Store home', properties: { sections: allowAll } } }
      )

      const { mergeDir } = prepareCpMergeDir(tempDir, {
        includeMyAccount: false,
        disabledSections: ['Hero'],
      })

      try {
        // No duplicate definition of `home` is generated.
        expect(
          fs.existsSync(
            path.join(
              mergeDir,
              'pages',
              'faststore-core',
              'cms_content_type__home.jsonc'
            )
          )
        ).toBe(false)

        // The store's own definition is kept, with its sections restricted.
        const storeHome = readStaged(
          mergeDir,
          'pages',
          'cms_content_type__customhome.jsonc'
        ).home
        expect(storeHome.title).toBe('Store home')
        expect(sectionKeys(storeHome)).toEqual([
          'Alert',
          'Newsletter',
          'StorePromo',
        ])

        expect(
          fs.existsSync(
            path.join(
              mergeDir,
              'pages',
              'faststore-core',
              'cms_content_type__pdp.jsonc'
            )
          )
        ).toBe(true)
      } finally {
        fs.rmSync(mergeDir, { recursive: true, force: true })
      }
    })

    it('keeps a store content-type that declares its own sections list', () => {
      const explicitSections = {
        type: 'array',
        items: { anyOf: [{ $ref: '#/components/Hero' }] },
      }
      writeSchema(
        path.join(storeDir, 'pages', 'cms_content_type__campaign.jsonc'),
        page('campaign', explicitSections)
      )

      const { mergeDir } = prepareCpMergeDir(tempDir, {
        includeMyAccount: false,
        disabledSections: ['Hero'],
      })

      try {
        expect(
          readStaged(mergeDir, 'pages', 'cms_content_type__campaign.jsonc')
            .campaign.properties.sections
        ).toEqual(explicitSections)
      } finally {
        fs.rmSync(mergeDir, { recursive: true, force: true })
      }
    })

    it('restricts the My Account content-types when My Account is enabled', () => {
      const { mergeDir } = prepareCpMergeDir(tempDir, {
        includeMyAccount: true,
        disabledSections: ['Hero'],
      })

      try {
        const myAccountProfile = readStaged(
          mergeDir,
          'pages',
          'cms_content_type__myaccountprofile.jsonc'
        ).myAccountProfile

        expect(sectionKeys(myAccountProfile)).toEqual([
          'Alert',
          'Newsletter',
          'AccountProfile',
          'StorePromo',
        ])
        expect(
          sectionKeys(
            readStaged(
              mergeDir,
              'pages',
              'faststore-core',
              'cms_content_type__home.jsonc'
            ).home
          )
        ).toContain('AccountProfile')
      } finally {
        fs.rmSync(mergeDir, { recursive: true, force: true })
      }
    })

    it('restricts a store content-type that inherits sections from the base page template', () => {
      writeSchema(
        path.join(storeDir, 'pages', 'cms_content_type__campaign.jsonc'),
        {
          campaign: {
            $extends: ['#/components/base-page-template'],
            title: 'Campaign',
            properties: { slug: { type: 'string' } },
          },
        }
      )

      const { mergeDir } = prepareCpMergeDir(tempDir, {
        includeMyAccount: false,
        disabledSections: ['Hero'],
      })

      try {
        const campaign = readStaged(
          mergeDir,
          'pages',
          'cms_content_type__campaign.jsonc'
        ).campaign

        expect(campaign.properties.slug).toEqual({ type: 'string' })
        expect(sectionKeys(campaign)).toEqual([
          'Alert',
          'Newsletter',
          'StorePromo',
        ])
      } finally {
        fs.rmSync(mergeDir, { recursive: true, force: true })
      }
    })

    it('warns instead of claiming success when no content-type could be restricted', () => {
      const explicitSections = {
        type: 'array',
        items: { anyOf: [{ $ref: '#/components/Alert' }] },
      }
      writeSchema(
        path.join(storeDir, 'pages', 'cms_content_type__overrides.jsonc'),
        {
          ...page('home', explicitSections),
          ...page('pdp', explicitSections),
        }
      )

      const { mergeDir } = prepareCpMergeDir(tempDir, {
        includeMyAccount: false,
        disabledSections: ['Hero'],
      })

      try {
        expect(infoSpy).not.toHaveBeenCalled()
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('so no section was hidden')
        )
      } finally {
        fs.rmSync(mergeDir, { recursive: true, force: true })
      }
    })

    function stagingLeftovers() {
      const stagingParent = path.join(tempDir, '.faststore')
      return fs
        .readdirSync(stagingParent)
        .filter((name) => name.startsWith('cms-merge-'))
    }

    it('fails and cleans up when a component file starts with a UTF-8 BOM', () => {
      writeSchema(
        path.join(storeDir, 'components', 'cms_component__bom.jsonc'),
        `﻿${JSON.stringify(component('BomSection'))}`
      )

      // The error points to the store's file, not its temporary staged copy.
      expect(() =>
        prepareCpMergeDir(tempDir, {
          includeMyAccount: false,
          disabledSections: ['Hero'],
        })
      ).toThrow(
        `${path.join(storeDir, 'components', 'cms_component__bom.jsonc')} starts with a UTF-8 BOM`
      )
      expect(stagingLeftovers()).toEqual([])
    })

    it('fails and cleans up when a content-type file cannot be parsed', () => {
      writeSchema(
        path.join(storeDir, 'pages', 'cms_content_type__broken.jsonc'),
        '{ "broken": '
      )

      expect(() =>
        prepareCpMergeDir(tempDir, {
          includeMyAccount: false,
          disabledSections: ['Hero'],
        })
      ).toThrow(
        `Could not parse ${path.join(storeDir, 'pages', 'cms_content_type__broken.jsonc')}`
      )
      expect(stagingLeftovers()).toEqual([])
    })

    it('does not generate core overrides when no section is disabled', () => {
      const { mergeDir } = prepareCpMergeDir(tempDir, myAccountOnly)

      try {
        expect(
          fs.existsSync(path.join(mergeDir, 'pages', 'faststore-core'))
        ).toBe(false)
        expect(
          readStaged(
            mergeDir,
            'pages',
            'cms_content_type__myaccountprofile.jsonc'
          ).myAccountProfile.properties.sections
        ).toEqual(allowAll)
      } finally {
        fs.rmSync(mergeDir, { recursive: true, force: true })
      }
    })
  })

  describe('parseJsonc', () => {
    it('parses plain JSON', () => {
      expect(parseJsonc('{"a": [1, 2], "b": {"c": null}}')).toEqual({
        a: [1, 2],
        b: { c: null },
      })
    })

    it('ignores comments and trailing commas', () => {
      expect(
        parseJsonc(`{
          // line comment
          "a": [1, 2,], /* block
          comment */
          "b": { "c": true, }, // trailing
        }`)
      ).toEqual({ a: [1, 2], b: { c: true } })
    })

    it('keeps comment-like sequences and escaped quotes inside strings', () => {
      expect(
        parseJsonc(
          '{"url": "https://vtex.com", "glob": "a/*b*/", "quote": "say \\"hi\\" ,}"}'
        )
      ).toEqual({
        url: 'https://vtex.com',
        glob: 'a/*b*/',
        quote: 'say "hi" ,}',
      })
    })

    it('throws on invalid input', () => {
      expect(() => parseJsonc('{"a": }')).toThrow()
      expect(() => parseJsonc('[1,,2]')).toThrow()
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
