import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  allNewCustomContentTypes,
  allNewCustomSections,
  contentTypeDuplicates,
  coreContentTypes,
  coreSections,
  customContentTypesWithDuplicates,
  customSectionsWithDuplicates,
  sectionDuplicates,
} from '../__mocks__/hcms'

import { withBasePath } from './directory'
import {
  dedupeAndMergeDefinitions,
  filterDisabledSections,
  mergeCMSFile,
  splitCustomDefinitions,
} from './hcms'
import { logger } from './logger'

const fsExtraMocked = vi.hoisted(() => ({
  mkdirSync: vi.fn(),
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
  writeFileSync: vi.fn(),
}))

const pluginsMock = vi.hoisted(() => ({
  getPluginsList: vi.fn(),
  getPluginName: vi.fn((plugin: string) => plugin),
}))

vi.mock('fs-extra', () => ({ default: fsExtraMocked }))
vi.mock('./plugins', () => pluginsMock)
vi.mock('@inquirer/prompts', () => ({
  confirm: vi.fn().mockResolvedValue(true),
}))

describe('mergeCMSFile', () => {
  it("should create a resulting file that contains all core definitions if a custom definitions file doesn't exist", async () => {
    fsExtraMocked.existsSync.mockReturnValueOnce(false)
    fsExtraMocked.readFileSync.mockReturnValueOnce(
      JSON.stringify(coreContentTypes)
    )

    const { tmpCMSDir } = withBasePath('.')

    pluginsMock.getPluginsList.mockResolvedValue([])

    await mergeCMSFile('content-types.json', '.')

    expect(fsExtraMocked.writeFileSync).toHaveBeenCalledWith(
      path.join(tmpCMSDir('faststore-3'), 'content-types.json'),
      JSON.stringify(coreContentTypes)
    )

    fsExtraMocked.existsSync.mockReturnValueOnce(false)
    fsExtraMocked.readFileSync.mockReturnValueOnce(JSON.stringify(coreSections))

    await mergeCMSFile('sections.json', '.')

    expect(fsExtraMocked.writeFileSync).toHaveBeenCalledWith(
      path.join(tmpCMSDir('faststore-3'), 'sections.json'),
      JSON.stringify(coreSections)
    )
  })
})

describe('mergeCMSFile with contentSource.disabledSections', () => {
  let storeDir: string
  let files: Record<string, string>

  function writeStoreConfig(disabledSections: unknown) {
    fs.writeFileSync(
      path.join(storeDir, 'discovery.config.js'),
      `module.exports = ${JSON.stringify({
        contentSource: { project: 'faststore', disabledSections },
      })}`
    )
  }

  function writtenDefinitions(fileName: string) {
    const call = fsExtraMocked.writeFileSync.mock.calls.find(([filePath]) =>
      String(filePath).endsWith(fileName)
    )

    return JSON.parse(call?.[1] as string)
  }

  beforeEach(() => {
    storeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'faststore-hcms-'))
    files = {
      [path.join(withBasePath(storeDir).coreCMSDir, 'sections.json')]:
        JSON.stringify(coreSections),
      [path.join(withBasePath(storeDir).coreCMSDir, 'content-types.json')]:
        JSON.stringify(coreContentTypes),
    }

    fsExtraMocked.existsSync.mockImplementation(
      (filePath: string) => filePath in files
    )
    fsExtraMocked.readFileSync.mockImplementation(
      (filePath: string) => files[filePath]
    )
    fsExtraMocked.writeFileSync.mockClear()
    pluginsMock.getPluginsList.mockResolvedValue([])

    vi.spyOn(logger, 'info').mockImplementation(() => {})
    vi.spyOn(logger, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    fsExtraMocked.existsSync.mockReset()
    fsExtraMocked.readFileSync.mockReset()
    vi.restoreAllMocks()
    fs.rmSync(storeDir, { recursive: true, force: true })
  })

  it('removes disabled sections and warns about names that match nothing', async () => {
    writeStoreConfig(['Hero', 'Heroo'])

    await mergeCMSFile('sections.json', storeDir)

    expect(writtenDefinitions('sections.json')).toEqual(
      coreSections.filter(({ name }) => name !== 'Hero')
    )
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('Hiding disabled sections from the CMS: Hero')
    )
    expect(logger.warn).toHaveBeenCalledTimes(1)
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('no section named "Heroo"')
    )
  })

  it('keeps every section when disabledSections is empty', async () => {
    writeStoreConfig([])

    await mergeCMSFile('sections.json', storeDir)

    expect(writtenDefinitions('sections.json')).toEqual(coreSections)
    expect(logger.info).not.toHaveBeenCalled()
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it('hides a section even when the store overrides it', async () => {
    writeStoreConfig(['Hero'])
    files[path.join(withBasePath(storeDir).userCMSDir, 'sections.json')] =
      JSON.stringify(sectionDuplicates)

    await mergeCMSFile('sections.json', storeDir)

    const sections = writtenDefinitions('sections.json')
    expect(sections.map(({ name }: { name: string }) => name)).not.toContain(
      'Hero'
    )
    // The other override still applies.
    expect(sections).toContainEqual(sectionDuplicates[0])
  })

  it('hides a section provided by a plugin', async () => {
    writeStoreConfig(['PluginBanner'])
    pluginsMock.getPluginsList.mockResolvedValue(['my-plugin'])
    files[
      withBasePath(storeDir).getPackagePath(
        'my-plugin',
        'cms',
        'faststore',
        'sections.json'
      )
    ] = JSON.stringify([{ name: 'PluginBanner', schema: {} }])

    await mergeCMSFile('sections.json', storeDir)

    expect(writtenDefinitions('sections.json')).toEqual(coreSections)
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it('never filters content-types.json', async () => {
    writeStoreConfig(['Error 404', 'Hero'])

    await mergeCMSFile('content-types.json', storeDir)

    expect(writtenDefinitions('content-types.json')).toEqual(coreContentTypes)
    expect(logger.warn).not.toHaveBeenCalled()
  })
})

describe('filterDisabledSections', () => {
  it('returns every section when the list is empty', () => {
    expect(filterDisabledSections(coreSections, [])).toEqual({
      sections: coreSections,
      hidden: [],
      unknown: [],
    })
  })

  it('removes the listed sections', () => {
    expect(filterDisabledSections(coreSections, ['Hero', 'Search'])).toEqual({
      sections: coreSections.filter(
        ({ name }) => name !== 'Hero' && name !== 'Search'
      ),
      hidden: ['Hero', 'Search'],
      unknown: [],
    })
  })

  it('reports names that match no section', () => {
    expect(filterDisabledSections(coreSections, ['Hero', 'Heroo'])).toEqual({
      sections: coreSections.filter(({ name }) => name !== 'Hero'),
      hidden: ['Hero'],
      unknown: ['Heroo'],
    })
  })

  it('removes an overridden section', () => {
    const overridden = dedupeAndMergeDefinitions(
      coreSections,
      sectionDuplicates,
      'name'
    )

    const { sections, hidden } = filterDisabledSections(overridden, ['Hero'])

    expect(sections.map(({ name }) => name)).not.toContain('Hero')
    expect(sections).toContainEqual(sectionDuplicates[0])
    expect(hidden).toEqual(['Hero'])
  })

  it('removes a section added by a plugin or the store', () => {
    const merged = [...coreSections, ...allNewCustomSections]

    expect(
      filterDisabledSections(merged, ['MembershipsAccordion']).sections
    ).toEqual([...coreSections, allNewCustomSections[1]])
  })
})

describe('splitCustomDefinitions', () => {
  it('should return empty arrays if there are no custom definitions', () => {
    // content-types
    expect(splitCustomDefinitions(coreContentTypes, [], 'id')).toEqual({
      duplicates: [],
      newDefinitions: [],
    })

    // sections
    expect(splitCustomDefinitions(coreSections, [], 'name')).toEqual({
      duplicates: [],
      newDefinitions: [],
    })
  })

  it('should return empty duplicates array if all custom definitions are new', () => {
    // content-types
    expect(
      splitCustomDefinitions(coreContentTypes, allNewCustomContentTypes, 'id')
    ).toEqual({
      duplicates: [],
      newDefinitions: allNewCustomContentTypes,
    })

    // sections
    expect(
      splitCustomDefinitions(coreSections, allNewCustomSections, 'name')
    ).toEqual({
      duplicates: [],
      newDefinitions: allNewCustomSections,
    })
  })

  it('should return expected split definitions', () => {
    // content-types
    expect(
      splitCustomDefinitions(
        coreContentTypes,
        customContentTypesWithDuplicates,
        'id'
      )
    ).toEqual({
      duplicates: contentTypeDuplicates,
      newDefinitions: allNewCustomContentTypes,
    })

    // sections
    expect(
      splitCustomDefinitions(coreSections, customSectionsWithDuplicates, 'name')
    ).toEqual({
      duplicates: sectionDuplicates,
      newDefinitions: allNewCustomSections,
    })
  })
})

describe('dedupeAndMergeDefinitions', () => {
  it('should return the exact same core definitions if there are no duplicates', () => {
    expect(dedupeAndMergeDefinitions(coreContentTypes, [], 'id')).toEqual(
      coreContentTypes
    )

    expect(dedupeAndMergeDefinitions(coreSections, [], 'name')).toEqual(
      coreSections
    )
  })

  it('should return expected merged definitions, applying overrides based on duplicates', () => {
    expect(
      dedupeAndMergeDefinitions(coreContentTypes, contentTypeDuplicates, 'id')
    ).toEqual([
      {
        id: '404',
        name: 'Error 404',
        configurationSchemaSets: [],
        isSingleton: true,
      },
      {
        id: '500',
        name: 'Error 500',
        configurationSchemaSets: [],
        isSingleton: true,
      },
      {
        id: 'globalSections',
        name: 'Global Sections',
        configurationSchemaSets: [],
        isSingleton: true,
      },
      {
        id: 'home',
        name: 'Home',
        isSingleton: true,
        configurationSchemaSets: [],
      },
      {
        id: 'landingPage',
        name: 'Landing Page',
        configurationSchemaSets: [],
      },
      {
        id: 'login',
        name: 'Custom Login. Why not...',
        configurationSchemaSets: [],
        isSingleton: true,
      },
      {
        id: 'pdp',
        name: 'Product Page',
        isSingleton: true,
        configurationSchemaSets: [],
      },
      {
        id: 'plp',
        name: 'Product List Page',
        isSingleton: true,
        configurationSchemaSets: [],
      },
      {
        id: 'search',
        name: 'Custom Search Page',
        isSingleton: true,
        configurationSchemaSets: [],
      },
    ])

    expect(
      dedupeAndMergeDefinitions(coreSections, sectionDuplicates, 'name')
    ).toEqual([
      {
        name: 'Alert',
        schema: {
          title: 'Alert',
          description: 'Add an alert',
          properties: {},
        },
      },
      {
        name: 'BannerNewsletter',
        schema: {
          title: 'Newsletter + Cool Banner',
          description: 'Totally not spam.',
          properties: {},
        },
      },
      {
        name: 'Hero',
        schema: {
          title: 'Hero',
          description:
            'Very careful with the image you choose here... not that we have anything to hide ;)',
          properties: {},
        },
      },
      {
        name: 'Navbar',
        schema: {
          title: 'Navbar',
          description: 'Navbar configuration',
          properties: {},
        },
      },
      {
        name: 'ProductShelf',
        schema: {
          title: 'Product Shelf',
          description: 'Add custom shelves to your store',
          properties: {},
        },
      },
      {
        name: 'Search',
        schema: {
          title: 'Search Bar',
          description: 'Search Bar Configuration',
          properties: {},
        },
      },
    ])
  })
})
