import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { followPriceAffectingParams } from '../../../../../src/platforms/vtex/utils/priceAffectingParams'

const apiRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  '..',
  '..'
)

const source = (relativePath: string) =>
  readFileSync(resolve(apiRoot, relativePath), 'utf8')

const typeBlock = (schema: string, typeName: string) => {
  const match = schema.match(
    new RegExp(`export type ${typeName} = \\{[\\s\\S]*?\\n\\}`)
  )

  if (!match) {
    throw new Error(`missing ${typeName}`)
  }

  return match[0]
}

describe('followPriceAffectingParams', () => {
  it('returns the same string when its length is greater than zero', () => {
    expect(followPriceAffectingParams('  ')).toBe('  ')
    expect(followPriceAffectingParams('{}')).toBe('{}')

    const unsorted = '{"b":1,"a":2}'
    const sorted = '{"a":2,"b":1}'

    expect(followPriceAffectingParams(unsorted)).toBe(unsorted)
    expect(followPriceAffectingParams(unsorted)).not.toBe(sorted)
  })

  it('returns null for undefined, null, and an empty string', () => {
    expect(followPriceAffectingParams(undefined)).toBeNull()
    expect(followPriceAffectingParams(null)).toBeNull()
    expect(followPriceAffectingParams('')).toBeNull()
  })
})

describe('priceAffectingParams schema', () => {
  const schema = source('src/__generated__/schema.ts')

  it('adds the optional argument on product, search, and validateCart', () => {
    for (const typeName of [
      'QueryProductArgs',
      'QuerySearchArgs',
      'MutationValidateCartArgs',
    ]) {
      expect(typeBlock(schema, typeName)).toContain(
        "priceAffectingParams?: InputMaybe<Scalars['String']['input']>"
      )
    }
  })

  it('adds priceAffectingParams on StoreOfferPriceState', () => {
    expect(typeBlock(schema, 'StoreOfferPriceState')).toContain(
      "priceAffectingParams?: Maybe<Scalars['String']['output']>"
    )
  })

  it('keeps reasonKey as String and does not declare priceVariations', () => {
    const offer = source('src/platforms/vtex/typeDefs/offer.graphql')

    expect(offer).toContain('reasonKey: String')
    expect(offer).not.toContain('priceVariations')
  })
})
