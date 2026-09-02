import path from 'node:path'
import ts from 'typescript'
import { beforeAll, describe, expect, it } from 'vitest'

/**
 * Regression tests for the public typings of `@faststore/api`.
 *
 * `Resolver`, `Options`, `PromiseType`, ... used to be ambient (script-scoped)
 * declarations in `src/typings/globals.ts`. Ambient types are not reachable
 * from the emitted `index.d.ts`, so a store importing `GraphqlResolver` or
 * `APIOptions` saw them silently degrade to `any` under `strict: true`.
 *
 * These tests compile consumer snippets against the package entrypoint the
 * same way a store would (strict + noImplicitAny) and assert that the types
 * are real: valid usage compiles cleanly and invalid usage is rejected.
 */

const PACKAGE_ROOT = path.resolve(__dirname, '../..')
const VIRTUAL_DIR = path.join(PACKAGE_ROOT, 'test/__virtual__')

const compilerOptions: ts.CompilerOptions = {
  strict: true,
  noImplicitAny: true,
  noEmit: true,
  skipLibCheck: true,
  esModuleInterop: true,
  resolveJsonModule: true,
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'],
  // Do not pull every @types/* package into the program: the snippets only
  // need the API entrypoint, and type-checking the whole graph is what makes
  // this test slow.
  types: [],
}

const consumers = {
  valid: `
    import type {
      APIOptions,
      ArrayElementType,
      FeatureFlags,
      GraphqlContext,
      GraphqlResolver,
      PromiseType,
      Resolver,
      StoreProductRoot,
    } from '../../src'

    type Source = { id: string; skus: string[] }

    export const productId: GraphqlResolver<Source, { upper: boolean }, string> =
      (source, vars, ctx) => {
        const account: string = ctx.account
        const flags: FeatureFlags = ctx.storage.flags
        const locale: string = ctx.storage.locale
        void account
        void flags
        void locale

        return vars.upper ? source.id.toUpperCase() : source.id
      }

    export const firstSku: Resolver<GraphqlContext, Source, {}, string> =
      (source) => source.skus[0]

    export type Sku = ArrayElementType<Source['skus']>
    export type Resolved = PromiseType<Promise<number>>
    export type OptionsAccount = APIOptions['account']
    // StoreProductRoot is built on PromiseType<ReturnType<...>>: if the
    // helper were missing it would collapse to any and this alias would
    // silently accept anything.
    export type ProductName = StoreProductRoot['isVariantOf']['productName']

    const sku: Sku = 'sku'
    const resolved: Resolved = 1
    const account: OptionsAccount = 'account'
    const productName: ProductName = 'name'
    void sku
    void resolved
    void account
    void productName
  `,
  invalid: `
    import type { GraphqlResolver } from '../../src'

    type Source = { id: string }

    export const broken: GraphqlResolver<Source> = (source, _vars, ctx) => {
      // Both accesses must be rejected: if the types collapsed to \`any\`
      // (the bug being guarded against) this would compile silently.
      return source.doesNotExist + ctx.doesNotExist
    }
  `,
} satisfies Record<string, string>

type ConsumerName = keyof typeof consumers

const virtualPath = (name: ConsumerName) => path.join(VIRTUAL_DIR, `${name}.ts`)

const virtualFiles = new Map<string, string>(
  (Object.keys(consumers) as ConsumerName[]).map((name) => [
    virtualPath(name),
    consumers[name],
  ])
)

/**
 * A single program for every snippet: the expensive part is type-checking the
 * package graph, which is shared, so compiling once keeps the test fast.
 */
function compileConsumers() {
  const host = ts.createCompilerHost(compilerOptions, true)
  const readFile = host.readFile
  const fileExists = host.fileExists

  host.fileExists = (fileName) =>
    virtualFiles.has(path.resolve(fileName)) || fileExists.call(host, fileName)
  host.readFile = (fileName) =>
    virtualFiles.get(path.resolve(fileName)) ?? readFile.call(host, fileName)

  const program = ts.createProgram(
    [...virtualFiles.keys()],
    compilerOptions,
    host
  )

  return (name: ConsumerName) => {
    const sourceFile = program.getSourceFile(virtualPath(name))

    if (!sourceFile) {
      throw new Error(`virtual consumer "${name}" was not loaded`)
    }

    return [
      ...program.getSyntacticDiagnostics(sourceFile),
      ...program.getSemanticDiagnostics(sourceFile),
    ].map((diagnostic) => ({
      code: diagnostic.code,
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
    }))
  }
}

describe('@faststore/api public typings', () => {
  let diagnosticsFor: ReturnType<typeof compileConsumers>

  // Type-checking the whole package graph takes a few seconds, more under
  // coverage instrumentation or on slow CI runners.
  beforeAll(() => {
    diagnosticsFor = compileConsumers()
  }, 60_000)

  it('exposes GraphqlResolver, GraphqlContext and helpers as real types', () => {
    expect(diagnosticsFor('valid')).toEqual([])
  })

  it('does not degrade resolver parameters to any', () => {
    const diagnostics = diagnosticsFor('invalid')
    const propertyDoesNotExist = 2339

    expect(diagnostics.map((d) => d.code)).toEqual([
      propertyDoesNotExist,
      propertyDoesNotExist,
    ])
    expect(diagnostics[0].message).toContain("'doesNotExist'")
    expect(diagnostics[1].message).toContain("'GraphqlContext'")
  })
})
