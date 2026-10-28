/**
 * Framework baseline Content Security Policy.
 *
 * The baseline is code: it ships with the framework and changes only through a
 * release. Per-account settings read from data-plane can add sources to these
 * directives, but never remove them. `{account}` is replaced with the store id
 * (`storeConfig.api.storeId`) when the policy is built.
 *
 * Security owns the first-party host list and confirms it before any account
 * moves to `enforce`.
 */

/** Directives the per-account settings may extend through `extraSources`. */
export type CspDirective =
  | 'default-src'
  | 'script-src'
  | 'style-src'
  | 'img-src'
  | 'font-src'
  | 'connect-src'
  | 'frame-src'
  | 'worker-src'
  | 'form-action'
  | 'object-src'
  | 'base-uri'

/** Emission order of the directives. Keeps the built header deterministic. */
export const CSP_DIRECTIVES: readonly CspDirective[] = [
  'default-src',
  'script-src',
  'style-src',
  'img-src',
  'font-src',
  'connect-src',
  'frame-src',
  'worker-src',
  'form-action',
  'object-src',
  'base-uri',
]

export interface Baseline {
  directives: Readonly<Record<CspDirective, readonly string[]>>
  /** `frame-ancestors` sources always present. `frameAncestors.sources` from data append to these. */
  frameAncestors: readonly string[]
}

/** Placeholder replaced with the store id in baseline and data sources. */
export const ACCOUNT_PLACEHOLDER = '{account}'

const VTEX_ACCOUNT_HOSTS = [
  'https://{account}.myvtex.com',
  'https://{account}.vtexcommercestable.com.br',
  'https://{account}.vtexcommercebeta.com.br',
] as const

export const baseline: Baseline = {
  directives: {
    'default-src': ["'self'"],
    // Inline bootstraps in _document.tsx and ThirdPartyScripts/vtex.tsx,
    // Partytown worker, Google Tag Manager.
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://io2.vtex.com',
      'https://activity-flow.vtex.com',
      'https://www.googletagmanager.com',
    ],
    // Next.js inline styles and the default WebFonts.tsx stylesheet.
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    // Image loader and GTM pixels.
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://{account}.vtexassets.com',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
    ],
    'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
    // Search analytics, redirects evaluation, VTEX scripts, merchant code, GA via GTM.
    'connect-src': [
      "'self'",
      'https://sp.vtex.com',
      ...VTEX_ACCOUNT_HOSTS,
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      'https://www.googletagmanager.com',
    ],
    // Checkout and login hosts.
    'frame-src': ["'self'", ...VTEX_ACCOUNT_HOSTS],
    // Partytown.
    'worker-src': ["'self'", 'blob:'],
    // Checkout, login and logout navigations.
    'form-action': ["'self'", ...VTEX_ACCOUNT_HOSTS],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
  },
  // Headless CMS preview runs on preview.vtex.app and is covered by 'self'.
  frameAncestors: ["'self'"],
}
