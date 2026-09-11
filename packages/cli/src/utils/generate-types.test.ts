import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { buildSchema, Kind } from 'graphql'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import genTsTypes, {
  getCodegenPointers,
  getTypeDefsFromFolder,
} from './generate-types'

// The real schema comes from @faststore/api, which under vitest resolves its
// own `graphql` instance ("Duplicate graphql modules"). Its content is
// irrelevant here: the store extension is what the generated types are
// checked for.
vi.mock('@faststore/api', () => ({
  GraphqlVtexSchema: () => buildSchema('type Query { ping: Boolean }'),
}))

// creates <root>/src/graphql/thirdParty/typeDefs/hello.graphql in a fresh
// temp dir whose name starts with the given prefix
function makeFixture(prefix: string) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix))

  const typeDefsDir = path.join(
    root,
    'src',
    'graphql',
    'thirdParty',
    'typeDefs'
  )
  fs.mkdirSync(typeDefsDir, { recursive: true })
  fs.writeFileSync(
    path.join(typeDefsDir, 'hello.graphql'),
    'extend type Query { hello: String! }'
  )

  return root
}

describe('getTypeDefsFromFolder', () => {
  // native separators on purpose — on Windows this produces backslashes,
  // which reproduces the bug where the globby pattern matched nothing
  let root: string
  // parentheses are glob-special characters, so a raw path.join pattern
  // matches nothing on POSIX too — this guards the regression on Linux CI
  let globSpecialRoot: string

  beforeAll(() => {
    root = makeFixture('faststore-typedefs-')
    globSpecialRoot = makeFixture('faststore-typedefs-(x86)-')
  })

  afterAll(() => {
    fs.rmSync(root, { recursive: true, force: true })
    fs.rmSync(globSpecialRoot, { recursive: true, force: true })
  })

  it('finds and parses custom typeDefs when root uses native path separators', async () => {
    const typeDefs = await getTypeDefsFromFolder(root, 'thirdParty')

    expect(typeDefs).toHaveLength(1)
    expect(typeDefs[0].kind).toBe(Kind.DOCUMENT)
  })

  it('finds custom typeDefs when the root path contains glob-special characters', async () => {
    const typeDefs = await getTypeDefsFromFolder(globSpecialRoot, 'thirdParty')

    expect(typeDefs).toHaveLength(1)
    expect(typeDefs[0].kind).toBe(Kind.DOCUMENT)
  })

  it('returns an empty array when the custom folder has no typeDefs', async () => {
    const typeDefs = await getTypeDefsFromFolder(root, 'vtex')

    expect(typeDefs).toHaveLength(0)
  })
})

describe('getCodegenPointers', () => {
  // a space is what breaks @graphql-tools/load: a pointer with whitespace that
  // is not valid SDL makes it throw instead of treating it as a glob
  const storeRoot = path.join(os.tmpdir(), 'my store (x86)')

  it('never embeds the absolute project path in the pointers', async () => {
    const pointers = await getCodegenPointers(storeRoot, storeRoot)

    expect(pointers).toEqual({
      documents: ['src/**/*.{ts,tsx}'],
      schema: '@generated/schema.graphql',
      outputDir: '@generated/',
    })
  })

  it('targets .faststore when the project has been generated', async () => {
    const generatedRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'fs store '))
    fs.mkdirSync(path.join(generatedRoot, '.faststore'))

    try {
      const pointers = await getCodegenPointers(generatedRoot, generatedRoot)

      expect(pointers).toEqual({
        documents: ['.faststore/src/**/*.{ts,tsx}'],
        schema: '.faststore/@generated/schema.graphql',
        outputDir: '.faststore/@generated/',
      })
    } finally {
      fs.rmSync(generatedRoot, { recursive: true, force: true })
    }
  })

  it('escapes glob-special characters only in the relative segments', async () => {
    const cwd = path.dirname(storeRoot)
    const pointers = await getCodegenPointers(storeRoot, cwd)

    expect(pointers.documents).toEqual(['my store \\(x86\\)/src/**/*.{ts,tsx}'])
    // the schema and the output dir are file paths, not globs
    expect(pointers.schema).toBe('my store (x86)/@generated/schema.graphql')
    expect(pointers.outputDir).toBe('my store (x86)/@generated/')
  })
})

describe('genTsTypes', () => {
  // full run of schema merge + graphql-codegen from a store whose absolute
  // path contains a space and glob-special characters
  let storeRoot: string
  let previousCwd: string

  beforeAll(() => {
    previousCwd = process.cwd()

    const parent = fs.mkdtempSync(
      path.join(os.tmpdir(), 'faststore gen (x86) ')
    )
    storeRoot = path.join(parent, 'store')

    const typeDefsDir = path.join(
      storeRoot,
      'src',
      'graphql',
      'thirdParty',
      'typeDefs'
    )
    fs.mkdirSync(typeDefsDir, { recursive: true })
    fs.writeFileSync(
      path.join(typeDefsDir, 'hello.graphql'),
      'extend type Query { hello: String! }'
    )

    const srcDir = path.join(storeRoot, '.faststore', 'src')
    fs.mkdirSync(srcDir, { recursive: true })
    fs.writeFileSync(
      path.join(srcDir, 'hello.ts'),
      [
        "import { gql } from '@faststore/core/api'",
        '',
        'export const query = gql(`query Hello { hello }`)',
        '',
      ].join('\n')
    )

    process.chdir(storeRoot)
  })

  afterAll(() => {
    process.chdir(previousCwd)
    fs.rmSync(path.dirname(storeRoot), { recursive: true, force: true })
  })

  it('generates the schema and the types when the store path contains spaces', async () => {
    await genTsTypes(storeRoot)

    const generated = path.join(storeRoot, '.faststore', '@generated')
    const schema = fs.readFileSync(
      path.join(generated, 'schema.graphql'),
      'utf-8'
    )
    const types = fs.readFileSync(path.join(generated, 'graphql.ts'), 'utf-8')

    expect(schema).toContain('hello: String!')
    expect(types).toContain('HelloQuery')
  }, 60_000)
})
