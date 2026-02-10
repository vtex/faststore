export interface Binding {
  currencyCode: string
  url: string
  salesChannel: string
  /**
   * When true, this binding is preferred for its locale in two cases:
   * (1) When the URL does not match any binding, the default locale's binding
   *     with isDefault is used for session/settings.
   * (2) When resolving locale+currency and multiple bindings match (e.g. same
   *     currency, different URLs), the one with isDefault is chosen.
   * Each locale should have exactly one binding with isDefault: true to avoid
   * ambiguous resolution.
   */
  isDefault: boolean
}

export interface Locale {
  code: string
  name: string
  languageCode: string
  languageName: string
  script: string
  textDirection: 'ltr' | 'rtl'
  regionCode: string
  bindings: Binding[]
}

export type BindingSelectorError =
  | { type: 'no-binding-found'; locale: string; currency: string }
  | { type: 'invalid-url'; url: string }
  | { type: 'no-currencies'; locale: string }
