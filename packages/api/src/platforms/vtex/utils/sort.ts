import { BadRequestError } from '../../errors'
import type { Sort } from './intelligentSearchRequest'

export const SORT_MAP = {
  price_desc: 'price:desc',
  price_asc: 'price:asc',
  orders_desc: 'orders:desc',
  name_desc: 'name:desc',
  name_asc: 'name:asc',
  release_desc: 'release:desc',
  discount_desc: 'discount:desc',
  score_desc: '',
} as const

/**
 * Resolves a `StoreSort` value to the Intelligent Search `sort=` query
 * string. `customSortMap` (from `Options.customSortMap`) is checked first, so
 * a project extending the `StoreSort` enum (`extend enum StoreSort { ... }`)
 * can register the corresponding Intelligent Search sort string without
 * forking this resolver.
 *
 * Throws instead of silently falling back to the default sort: unlike the
 * built-in enum values, a value coming from a project's schema extension
 * isn't guaranteed to have an entry here, and a silent fallback would look
 * like the custom sort worked when it was actually ignored.
 */
export function resolveSort(
  sort: string,
  customSortMap: Record<string, string>
): Sort {
  const resolved =
    customSortMap[sort] ?? (SORT_MAP as Record<string, string>)[sort]

  if (resolved === undefined) {
    throw new BadRequestError(`Unknown sort value: ${sort}`)
  }

  // `customSortMap` is caller-supplied config (arbitrary strings at the type
  // level), so it can't be statically narrowed to `Sort` — validity of the
  // Intelligent Search sort string itself is enforced by Intelligent Search.
  return resolved as Sort
}
