export interface Binding {
  currencyCode: string
  url: string
  salesChannel: string
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
