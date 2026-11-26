/**
 * Framework-owned Content Security Policy baseline.
 *
 * The baseline is code: it is versioned with the framework and changes only
 * through a release. Per-account data from `data-plane` may add sources to
 * these directives, but it can never remove a baseline source.
 *
 * `{account}` is replaced with `storeConfig.api.storeId` when the policy is
 * built. Security owns the list of first-party hosts below.
 *
 * Shared by v3 (Edge runtime) and v4 (Node runtime): plain objects only.
 */

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

export type Baseline = Readonly<Record<CspDirective, readonly string[]>>

/** Placeholder replaced with the store id (VTEX account name). */
export const ACCOUNT_PLACEHOLDER = '{account}'

/**
 * Order in which directives are serialized. Fixed so that the built header is
 * deterministic and diffable between accounts.
 */
export const CSP_DIRECTIVES: readonly CspDirective[] = [
  'default-src',
  'script-src',
  'worker-src',
  'connect-src',
  'img-src',
  'style-src',
  'font-src',
  'frame-src',
  'form-action',
  'object-src',
  'base-uri',
]

/** `frame-ancestors` sources always present. `frameAncestors.sources` from data append to these. */
export const DEFAULT_FRAME_ANCESTORS: readonly string[] = ["'self'"]

const VTEX_ACCOUNT_HOSTS = [
  'https://{account}.myvtex.com',
  'https://{account}.vtexcommercestable.com.br',
  'https://{account}.vtexcommercebeta.com.br',
] as const

export const baseline: Baseline = {
  'default-src': ["'self'"],
  // Inline bootstraps in _document.tsx and ThirdPartyScripts/vtex.tsx,
  // Partytown worker, GTM. Removing the unsafe-* keywords is out of scope
  // until nonces/hashes land.
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://io2.vtex.com',
    'https://activity-flow.vtex.com',
    'https://www.googletagmanager.com',
  ],
  // Partytown
  'worker-src': ["'self'", 'blob:'],
  // Search analytics, redirects evaluate, VTEX scripts and merchant code,
  // GA via GTM
  'connect-src': [
    "'self'",
    'https://sp.vtex.com',
    ...VTEX_ACCOUNT_HOSTS,
    'https://www.google-analytics.com',
    'https://analytics.google.com',
    'https://www.googletagmanager.com',
  ],
  // Image loader, GTM pixels
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://{account}.vtexassets.com',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
  ],
  // Next.js inline styles, default WebFonts.tsx
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  // Default fonts
  'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
  // Checkout and login hosts
  'frame-src': ["'self'", ...VTEX_ACCOUNT_HOSTS],
  // Checkout, login and logout navigations
  'form-action': ["'self'", ...VTEX_ACCOUNT_HOSTS],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
}
