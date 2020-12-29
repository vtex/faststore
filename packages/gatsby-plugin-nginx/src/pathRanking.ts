// path ranking algorithm copied (with small adjustments) from `gatsbyjs/gatsby` that copied from `@reach/router` (internal util, not exported from the package)
// https://github.com/gatsbyjs/gatsby/blob/3ce476b1eac97aedd16f9d150cd6a81f36255380/packages/gatsby/src/bootstrap/requires-writer.ts#L26
//
// Path ranking is necessary since gatsby uses this order to generate .cache/match-paths.json that is used internally in it's routing system.
// If we don't use the same order as of gatsby, we risk to serve a different page from what's gatsby router would have served, leading to
// all sort of wierd bugs
const paramRe = /^:(.+)/

const SEGMENT_POINTS = 4
const STATIC_POINTS = 3
const DYNAMIC_POINTS = 2
const SPLAT_PENALTY = 1
const ROOT_POINTS = 1

const isRootSegment = (segment: string) => segment === ''
const isDynamic = (segment: string) => paramRe.test(segment)
const isSplat = (segment: string | undefined) => segment && segment[0] === '*'

const segmentize = (uri: string) =>
  uri
    // strip starting/ending slashes
    .replace(/(^\/+|\/+$)/g, '')
    .split('/')

export const rankRoute = (route: Redirect, index: number) => {
  const { fromPath } = route
  const routeScore = segmentize(fromPath).reduce((score, segment) => {
    score += SEGMENT_POINTS
    if (isRootSegment(segment)) score += ROOT_POINTS
    else if (isDynamic(segment)) score += DYNAMIC_POINTS
    else if (isSplat(segment)) score -= SEGMENT_POINTS + SPLAT_PENALTY
    else score += STATIC_POINTS

    return score
  }, 0)

  return { route, score: routeScore, index }
}

export const rankRoutes = (routes: Redirect[]) =>
  routes
    .map(rankRoute)
    .sort((a, b) =>
      a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
    )
    .map(({ route }) => route)

// end of copied `gatsbyjs/gatsby` and `@reach/router` internals
