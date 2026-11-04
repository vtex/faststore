/**
 * Marks a resolver after a directive wrapper is installed.
 *
 * `GraphqlVtexSchema` applies every directive once, on the merged schema. A
 * `mergeSchema` that was already transformed (for example `withDirectives`,
 * which stayed public) would otherwise be wrapped again. The mark travels
 * with the resolver function through `mergeSchemas`.
 */
const appliedDirectives = Symbol('faststore.appliedDirectives')

type MarkedResolver = Function & {
  [appliedDirectives]?: ReadonlySet<string>
}

export function hasAppliedDirective(resolve: unknown, name: string): boolean {
  if (typeof resolve !== 'function') return false

  return (resolve as MarkedResolver)[appliedDirectives]?.has(name) ?? false
}

export function markAppliedDirective<T extends Function>(
  wrapped: T,
  previous: unknown,
  name: string
): T {
  const names = new Set<string>()

  if (typeof previous === 'function') {
    const previousNames = (previous as MarkedResolver)[appliedDirectives]

    if (previousNames) {
      for (const entry of previousNames) names.add(entry)
    }
  }

  names.add(name)
  ;(wrapped as MarkedResolver)[appliedDirectives] = names

  return wrapped
}

/** How many distinct directives wrap this resolver. Test helper. */
export function appliedDirectiveCount(resolve: unknown): number {
  if (typeof resolve !== 'function') return 0

  return (resolve as MarkedResolver)[appliedDirectives]?.size ?? 0
}
