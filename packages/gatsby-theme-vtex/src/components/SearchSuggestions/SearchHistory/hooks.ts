import { useSearchHistory as useDefaultSearchHistory } from '../../../sdk/search/useSearchHistory'
import { useSearchSuggestionsContext } from '../base/hooks'

export const useSearchHistory = () => {
  const context = useSearchSuggestionsContext()
  const history = useDefaultSearchHistory()
  const searches = history?.get().map((t) => ({ term: t, key: t }))

  return {
    searches,
    ...context,
  }
}
