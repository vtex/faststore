/**
 * Public localization API for custom navbars and layouts.
 * Prefer `import { … } from '@faststore/core/localization'` to limit bundle surface.
 */
export { default as LocalizationButton } from './src/components/ui/LocalizationButton'
export type {
  LocalizationButtonErrorMessages,
  LocalizationButtonProps,
} from './src/components/ui/LocalizationButton'

export { default as LocalizationSelector } from './src/components/localization/LocalizationSelector'
export type {
  LocalizationSelectorErrorMessages,
  LocalizationSelectorProps,
} from './src/components/localization/LocalizationSelector'

export { useBindingSelector } from './src/sdk/localization'
export type {
  Binding,
  BindingSelectorError,
  Locale,
  UseBindingSelectorReturn,
} from './src/sdk/localization'
