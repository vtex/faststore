import path from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

/**
 * Regression tests for the public typings of `@faststore/api`.
 *
 * `Resolver`, `Options`, `PromiseType`, ... used to be ambient (script-scoped)
 * declarations in `src/typings/globals.ts`. Ambient types are not reachable
 * from the emitted `index.d.ts`, so a store importing `GraphqlResolver` or
 * `APIOptions` saw them silently degrade to `any` under `strict: true`.
 *
 * These tests compile a consumer snippet against the package entrypoint the
 * same way a store would (strict + noImplicitAny) and assert that the types
 * are real: valid usage compiles cleanly and invalid usage is rejected.
 */

const PACKAGE_ROOT = path.resolve(__dirname, '../..')
const VIRTUAL_FILE = path.join(PACKAGE_ROOT, 'test/__virtual__/consumer.ts')

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
}

function compileConsumer(source: string) {
  const host = ts.createCompilerHost(compilerOptions, true)
  const readFile = host.readFile
  const fileExists = host.fileExists

  host.fileExists = (fileName) =>
    path.resolve(fileName) === VIRTUAL_FILE || fileExists.call(host, fileName)
  host.readFile = (fileName) =>
    path.resolve(fileName) === VIRTUAL_FILE
      ? source
      : readFile.call(host, fileName)

  const program = ts.createProgram([VIRTUAL_FILE], compilerOptions, host)
  const sourceFile = program.getSourceFile(VIRTUAL_FILE)

  if (!sourceFile) {
    throw new Error('virtual consumer file was not loaded by the program')
  }

  return [
    ...program.getSyntacticDiagnostics(sourceFile),
    ...program.getSemanticDiagnostics(sourceFile),
  ].map((diagnostic) => ({
    code: diagnostic.code,
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
  }))
}

describe('@faststore/api public typings', () => {
  it('exposes GraphqlResolver, GraphqlContext and helpers as real types', () => {
    const diagnostics = compileConsumer(`
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
    `)

    expect(diagnostics).toEqual([])
  })

  it('does not degrade resolver parameters to any', () => {
    const diagnostics = compileConsumer(`
      import type { GraphqlResolver } from '../../src'

      type Source = { id: string }

      export const broken: GraphqlResolver<Source> = (source, _vars, ctx) => {
        // Both accesses must be rejected: if the types collapsed to \`any\`
        // (the bug being guarded against) this would compile silently.
        return source.doesNotExist + ctx.doesNotExist
      }
    `)

    const propertyDoesNotExist = 2339

    expect(diagnostics.map((d) => d.code)).toEqual([
      propertyDoesNotExist,
      propertyDoesNotExist,
    ])
    expect(diagnostics[0].message).toContain("'doesNotExist'")
    expect(diagnostics[1].message).toContain("'GraphqlContext'")
  })
})
