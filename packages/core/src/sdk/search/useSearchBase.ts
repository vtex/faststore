import { useLink } from 'src/sdk/ui/useLink'

/**
 * Returns the resolved search base path (e.g. `/s`, `/emea-eur/s`, or `/pt-BR/s`)
 * for building search URLs. Use with formatSearchPath so links respect locale and custom path.
 */
export function useSearchBase(): string {
  const { resolveLink } = useLink()
  return resolveLink('/s') ?? '/s'
}
