interface MatcherArgs {
  pathname: string
}

interface MatcherReturn {
  destination: string
  permanent?: boolean
}

export function matcher(_: MatcherArgs): MatcherReturn | null {
  return null
}
