import path from 'path'
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

import {
  dedupeAndMergeDefinitions,
  splitCustomDefinitions,
  mergeCMSFile,
} from './hcms'
// FIXME: use withBasePath
// import { tmpCMSDir } from './directory'

jest.mock('fs-extra', () => ({
  readFileSync: jest.fn(),
  existsSync: jest.fn(),
  writeFileSync: jest.fn(),
}))

describe('mergeCMSFile', () => {
  it.skip("should create a resulting file that contains all core definitions if a custom definitions file doesn't exist", async () => {
    const { readFileSync, existsSync, writeFileSync } = require('fs-extra')
    const tmpCMSDir = ''

    existsSync.mockReturnValueOnce(false)
    readFileSync.mockReturnValueOnce(JSON.stringify(coreContentTypes))

    await mergeCMSFile('content-types.json')

    expect(writeFileSync).toHaveBeenCalledWith(
      path.join(tmpCMSDir, 'content-types.json'),
      JSON.stringify(coreContentTypes)
    )

    existsSync.mockReturnValueOnce(false)
    readFileSync.mockReturnValueOnce(JSON.stringify(coreSections))

    await mergeCMSFile('sections.json')

    expect(writeFileSync).toHaveBeenCalledWith(
      path.join(tmpCMSDir, 'sections.json'),
      JSON.stringify(coreSections)
    )
  })
})

describe('splitCustomDefinitions', () => {
  it.skip('should return empty arrays if there are no custom definitions', () => {
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

  it.skip('should return empty duplicates array if all custom definitions are new', () => {
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

  it.skip('should return expected split definitions', () => {
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
  it.skip('should return the exact same core definitions if there are no duplicates', () => {
    expect(dedupeAndMergeDefinitions(coreContentTypes, [], 'id')).toEqual(
      coreContentTypes
    )

    expect(dedupeAndMergeDefinitions(coreSections, [], 'name')).toEqual(
      coreSections
    )
  })

  it.skip('should return expected merged definitions, applying overrides based on duplicates', () => {
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
