import { createStore } from '@vtex/faststore-sdk-internal'
import { useStore } from '../useStore'

/**
 * Localization settings store
 * Stores available locales, URL mappings, and other localization-related configuration
 */

export type LocalizationStore = {
  locales: string[]
  urls: Record<string, string>
}

export const localizationStore = createStore<LocalizationStore>(
  {
    locales: [],
    urls: {},
  },
  'fs::localization'
)

export const useLocalization = () => {
  return useStore(localizationStore)
}
