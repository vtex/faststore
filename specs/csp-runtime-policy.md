# Runtime Content Security Policy

> **Status**: Draft
> **Created**: 2026-10-26

> **References**
> - RFC: [Enforcing Content Security Policy on VTEX Checkouts and Storefronts](https://docs.google.com/document/d/1vmIfysU-wrWd7r30arEab-OyqjR3OwZU0G2AFepX1vY/edit) (draft 0.1, 2026-10-15)
> - Report endpoint: `https://endpointcsp.vtex.com/api/report`
> - Prior art (not merged, not a reference for policy content): PR #3151 (`frame-ancestors` only), PR #3146, PR #3150
> - Precedent for per-request runtime settings in the framework: `packages/core/src/server/password-protection-service.ts`

## 1. Business Context

### Problem Statement

FastStore storefronts send no `Content-Security-Policy`, no `Content-Security-Policy-Report-Only`, no `frame-ancestors` and no `X-Frame-Options`. This is true on both supported lines: v3 (`3.x`, currently 3.100.6) and v4 (`dev`, currently 4.10.1-dev). Once a script reaches the page, the browser runs it and lets it send data anywhere, and nobody is alerted.

The [RFC](https://docs.google.com/document/d/1vmIfysU-wrWd7r30arEab-OyqjR3OwZU0G2AFepX1vY/edit) requires that every in-scope system, FastStore included, can run a per-account policy in Report-Only or enforce mode, and that Product Support can enable, disable and roll back that policy **without an engineering deploy**. Today the only way to add a header to a FastStore store is a framework release followed by a store build.

**Who is affected:** shoppers (card and personal data exposure), merchants (incident load), Product Support and Security (no toggle, no rollback, no signal).

### Goals

Give the framework a runtime CSP mechanism that ships once and is then driven entirely by data.

- The storefront reads a per-account CSP settings record from `data-plane` at request time and emits the matching headers.
- Mode changes (`off`, `report-only`, `enforce`) take effect without a build or a deploy of the store.
- The framework owns a versioned **baseline** policy that already allows VTEX first-party origins. Merchant-specific origins come from the settings record. Per-account customization adds to the baseline and never removes from it.
- A `data-plane` outage never breaks a store: the mechanism fails open and sends no header.
- The same behavior ships on v3 and v4 with one shared design and version-specific wiring.

### User Stories

#### US-1: Product Support enables Report-Only on one account

- **Story**: As Product Support, I want to switch an account to Report-Only from the `data-plane` tooling, so that the CSP report service starts receiving that store's violations.
- **Acceptance Criteria**:
  - **Given** an account with `mode: off`, **when** the record changes to `report-only`, **then** within the cache TTL every HTML response from that store carries `Content-Security-Policy-Report-Only` and `Reporting-Endpoints`.
  - **Given** the same change, **when** a page is served, **then** nothing is blocked and the page renders as before.

#### US-2: Product Support rolls back an enforced policy

- **Story**: As Product Support, I want to set an account back to `report-only` or `off` during the Black Friday freeze, so that a broken checkout flow recovers in minutes.
- **Acceptance Criteria**:
  - **Given** an account in `enforce`, **when** the record changes to `off`, **then** within the cache TTL the origin stops sending CSP headers.
  - **Given** CloudFront still holds cached HTML, **then** the rollback reaches shoppers only after the CDN TTL expires or an invalidation runs (see Constraints).

#### US-3: Security adds a merchant origin without touching code

- **Story**: As Security, I want to append an allowed origin to one account's `connect-src`, so that a legitimate merchant integration keeps working under enforcement.
- **Acceptance Criteria**:
  - **Given** a settings record with `extraSources.connect-src: ["https://cdn.example.com"]`, **when** a page is served, **then** the emitted `connect-src` contains the baseline sources plus that origin, with no duplicates.

#### US-4: The framework survives a `data-plane` outage

- **Story**: As a merchant, I want my store to keep serving pages if the settings service is down, so that a security control never turns into an availability incident.
- **Acceptance Criteria**:
  - **Given** the settings call times out or returns a non-2xx status, **when** a page is served, **then** the store responds normally, with the last known good settings while they are within the stale window, and with no CSP header after that.

### Key Scenarios

1. **Default state.** No record exists for the account. The store sends no CSP header.
2. **Report-Only everywhere, enforce framing.** `mode: report-only` and `frameAncestors.mode: enforce`. The store sends both headers: `Content-Security-Policy` with only `frame-ancestors`, and `Content-Security-Policy-Report-Only` with the full policy.
3. **Enforce.** `mode: enforce`. One `Content-Security-Policy` header with the full policy including `frame-ancestors`.
4. **Password-protected store.** The password check runs first. CSP headers are added only to responses that pass through (`NextResponse.next()` or a rewrite), never to the unlock redirect.
5. **Localized store (v4).** The locale rewrite response carries the CSP headers.

### Functional Requirements

- FR-1: `proxy.ts` (v4) and `middleware.ts` (v3) MUST read the account's CSP settings from `data-plane` on every matched request, through an in-memory cache.
- FR-2: The framework MUST emit `Reporting-Endpoints`, plus `Content-Security-Policy-Report-Only` and/or `Content-Security-Policy` according to `mode` and `frameAncestors.mode`.
- FR-3: The policy MUST be built from a baseline that lives in code plus per-account additions from the record. The account id MUST be substituted into first-party VTEX hosts.
- FR-4: `report-uri` and `report-to` MUST both be present, pointing at the report endpoint with the account id in the query string.
- FR-5: A missing record, a failed call or a malformed record MUST result in no CSP header (fail open).
- FR-6: Settings MUST be cached in memory for `CSP_SETTINGS_TTL_MS` (default 60 s) and served stale for up to `CSP_SETTINGS_STALE_MS` (default 10 min) on error.
- FR-7: The mechanism MUST NOT change the existing matcher, the password protection flow, or the localization rewrite behavior.
- FR-8: The settings origin MUST be configurable with `DATA_PLANE_API_URL`. The default is `https://faststore.vtex.com`, the same default `WEBOPS_API_URL` has.
- FR-9: Each settings call MUST time out after `CSP_SETTINGS_TIMEOUT_MS` (default 500 ms). After a failed call, no new call for the same store MUST start for 60 seconds, whatever the TTL.

### Non-Functional Requirements

- NFR-1: Added latency on a cache hit MUST be under 1 ms. A cache miss MUST be bounded by `CSP_SETTINGS_TIMEOUT_MS` (default 500 ms) and MUST NOT block the page beyond that bound.
- NFR-2: No new runtime dependency in `@faststore/core`.
- NFR-3: v3 `middleware.ts` runs on the Edge runtime (Next.js 13.5). Shared code MUST use only `fetch`, `URL`, `AbortSignal.timeout` and plain objects. No Node built-ins.
- NFR-4: Changes to CSP mechanisms require explicit human approval recorded in the PR description (root `AGENTS.md`, Security & Data Handling).
- NFR-5: Unit coverage for the policy builder and the settings client on both lines.

### Out of Scope

- Nonces, hashes and `'strict-dynamic'`. These need changes to `_document.tsx`, the Partytown bootstrap and the GTM snippet, and are a post-Black Friday item.
- Removing `'unsafe-inline'`, `'unsafe-eval'` and multi-tenant wildcards from the baseline.
- The `data-plane` service itself: its storage, UI, audit log and API implementation. This spec defines only the read contract the framework depends on.
- CloudFront configuration and cache invalidation on mode change.
- Merchant self-service in the Admin.
- The CSP report service.
- Other security headers (HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).

## 2. Arch Decisions

### Proposed Solution

Add a small server-side module, `packages/core/src/server/csp/`, with three parts: a `data-plane` settings client with cache and fail-open semantics, a deterministic policy builder that merges the framework baseline with per-account additions, and a thin service that `proxy.ts` (v4) and `middleware.ts` (v3) call after password protection passes. The service sets the headers on the response the middleware already returns.

The baseline is code. It is versioned with the framework and changes through a normal release. Per-account data (mode, extra sources, `frame-ancestors`) is read at runtime from `data-plane`. Product Support changes the record; the store picks it up within the cache TTL.

### Architecture Overview

```
request
  │
  ▼
proxy.ts (v4) / middleware.ts (v3)
  │
  ├─ PasswordProtectionService.checkStoreProtection()
  │     └─ not 200 → return (no CSP headers)
  │
  ├─ response = localizationRewrite() (v4) | NextResponse.next() (v3)
  │
  └─ CspService.apply(response)
        │
        ├─ settings = SettingsClient.get(storeId)
        │     ├─ cache hit (< TTL)          → cached record
        │     ├─ cache stale (< STALE)      → cached record, refresh in background
        │     └─ miss / error / timeout     → null  (fail open)
        │
        ├─ settings == null || mode == off → return response unchanged
        │
        └─ PolicyBuilder.build(baseline, settings, storeId)
              └─ response.headers.set(Reporting-Endpoints, CSP, CSP-Report-Only)
  ▼
page / _next/data
```

Files:

```
packages/core/src/server/csp/
├── baseline.ts          # framework baseline per directive, with {account} placeholders
├── data-plane-api.ts    # URL builders, env handling, timeouts (mirrors password-protection/webops-api.ts)
├── settings-client.ts   # fetch + in-memory cache + stale-on-error + fail open
├── policy-builder.ts    # pure: (baseline, settings, storeId) → { csp?, cspReportOnly?, reportingEndpoints }
├── csp-service.ts       # glue: apply(response, storeId)
└── index.ts
```

### Alternatives Considered

| Alternative | Pros | Cons | Verdict |
|---|---|---|---|
| **Runtime settings from `data-plane`, baseline in code (chosen)** | No deploy to toggle; baseline reviewed in code; same pattern as password protection | Needs a `data-plane` read contract; CDN cache delays rollback | **Accepted** |
| Static `headers()` in `next.config.js` (PR #3151 approach) | Trivial; works in standalone | Every change is a release plus a store build; no per-account mode | Rejected for runtime control. May still carry a global `frame-ancestors` later |
| Settings from `discovery.config.js` | No external call | Build-time only; merchants control it, not Product Support | Rejected |
| Settings from env vars | No external call | Changing env restarts the pod; no audit | Rejected |
| WebOps as the settings source | Endpoint pattern already exists | WebOps is an operations surface, not the system that should decide security policy for stores | Rejected per team decision; `data-plane` owns the record |
| CloudFront Function + KeyValueStore only | Instant toggle; covers stores on old versions | No per-route control; no path to nonces; AWS-only | Complementary. Recommended for the first rollout; this spec is the framework-side mechanism |

### Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| `data-plane` slow or down on Black Friday | High | Low | Fail open, 500 ms timeout, stale window, no header on exhaustion |
| CloudFront serves cached HTML with the old header after a rollback | High | High | Documented constraint; `data-plane` triggers invalidation on mode change, or the kill switch stays at CloudFront |
| Baseline misses a VTEX origin and enforce breaks a flow | High | Med | Baseline only promoted after Report-Only waves; Security owns the first-party host list |
| Policy string exceeds proxy or CDN header limits | Med | Low | Builder caps total length at 8 KB and logs a warning; `extraSources` validated on the `data-plane` side |
| Stores on older releases send nothing | Med | High | Known. CloudFront layer covers them; the upgrade path is the normal release train |
| Middleware edge-runtime incompatibility on v3 | Med | Low | Shared code limited to Web APIs (NFR-3); tested under Jest with the edge environment |
| Header applied to the unlock redirect or to error responses | Low | Low | `apply()` only runs on the pass-through branch |

### Key Decisions

#### Decision 1: `data-plane` is the single source for per-account CSP settings

- **Status**: Accepted
- **Context**: Password protection reads per-store status from WebOps on every request. The team decided that security policy for stores must not depend on WebOps.
- **Decision**: The framework reads `GET {DATA_PLANE_API_URL}/api/v1/csp/settings?storeId={account}`. The exact path is confirmed with the `data-plane` team before merge. The default origin is `https://faststore.vtex.com`, the same default `WEBOPS_API_URL` has, and `DATA_PLANE_API_URL` overrides it with the same parsing rules.
- **Consequences**: One new outbound dependency from the store server. The read is unauthenticated and the record contains no secrets. Integrity relies on TLS to the `data-plane` origin.

#### Decision 2: Fail open

- **Status**: Accepted
- **Context**: Password protection fails closed because it guards access. CSP is defense in depth.
- **Decision**: Any failure to obtain or parse settings results in no CSP header. Stale cached settings are used for up to `CSP_SETTINGS_STALE_MS`. A call is bounded by the 500 ms timeout, and after a failure the client waits 60 seconds before the next call for that store, so an outage costs page requests at most one short call per minute.
- **Consequences**: A long `data-plane` outage turns CSP off with no signal from the store itself. The settings client logs once per outage window, and the RFC's report service sees the drop in reports.

#### Decision 3: Baseline in code, additions in data

- **Status**: Accepted
- **Context**: The RFC asks for a baseline that already allows VTEX trusted origins so that reports only show merchant origins.
- **Decision**: `baseline.ts` holds the directive map with `{account}` placeholders. The record may only **add** sources per directive, including `frame-ancestors`: `frameAncestors.sources` are appended to the default `'self'` and never replace it. It cannot remove baseline sources or add `'unsafe-*'` keywords. The builder rejects such entries and logs. A `'none'` next to other sources is dropped, because browsers ignore it there.
- **Consequences**: A new VTEX first-party host requires a framework release. Merchant origins do not.

#### Decision 4: Two modes, independent framing mode

- **Status**: Accepted
- **Context**: Clickjacking protection can be enforced before the script policy is ready.
- **Decision**: `mode` controls the full policy. `frameAncestors.mode` controls `frame-ancestors` independently. When they differ, two headers are sent.
- **Consequences**: Scenario 2 above is the expected Phase 2 shape for most accounts.

#### Decision 5: Headers are set in the middleware layer, not in `next.config.js`

- **Status**: Accepted
- **Context**: `headers()` is static. The middleware already runs per request on both lines and already carries a per-store runtime read.
- **Decision**: `CspService.apply()` is called from `proxy.ts` (v4) and `middleware.ts` (v3) on the pass-through branch.
- **Consequences**: v3 excludes `/api` from the matcher; JSON responses need no CSP, so this is acceptable. The v4 matcher covers `_next/data`; the header on JSON is harmless.

### Implementation Plan

Version-neutral steps first, then wiring per line. Both lines ship the same `src/server/csp/` module. Differences are confined to the middleware file, the test runner and the runtime.

1. **Baseline**: `baseline.ts` with the inventory in §3. Unit tests assert placeholder substitution and that no `'unsafe-*'` keyword can be added from data.
2. **Settings client**: `data-plane-api.ts` and `settings-client.ts`. Tests cover cache hit, stale-on-error, timeout, non-2xx, malformed body, and that failures return `null`.
3. **Policy builder**: pure function with deterministic output. Tests cover each mode combination, deduplication, `report-uri` and `report-to` presence, and the 8 KB cap.
4. **Service**: `csp-service.ts`. Tests confirm headers are set on `NextResponse.next()` and on a rewrite response, and never on a redirect.
5. **v4 wiring (`dev`)**: call `CspService.apply(response, storeConfig.api.storeId)` in `proxy.ts` after cookies are copied, before `return response`. Vitest, Node environment, under `packages/core/test/server/csp/`.
6. **v3 wiring (`3.x`)**: call the service in `middleware.ts` on the `storeProtectionResult.response` branch and on the redirects branch only when status is 200. Jest, `@edge-runtime/jest-environment` or an equivalent fetch mock, under `packages/core/test/server/csp/`.
7. **Env and docs**: add `DATA_PLANE_API_URL`, `CSP_SETTINGS_TTL_MS`, `CSP_SETTINGS_STALE_MS`, `CSP_SETTINGS_TIMEOUT_MS` to `turbo.json` `globalEnv` and `packages/core/vtex.env` docs.
8. **Lighthouse**: keep `csp-xss: 'off'` in `lighthouserc.js` until a baseline is enforced on the CI store, then enable it.
9. **PR**: record the explicit human approval for the CSP mechanism in the PR description (NFR-4). Conventional commit scope `core`.

Version matrix:

| Item | v4 (`dev`) | v3 (`3.x`) |
|---|---|---|
| Entry point | `src/proxy.ts`, `export async function proxy` | `src/middleware.ts`, `export async function middleware` |
| Runtime | Node (Next.js 16 default) | Edge (Next.js 13.5) |
| Response to decorate | result of `localizationRewrite()` | `storeProtectionResult.response` or the redirect response |
| Matcher change | none | none |
| Test runner | Vitest, `test/server/csp/*.test.ts` | Jest, `test/server/csp/*.test.ts` |
| Release line | next 4.x minor | next 3.100.x patch |

## 3. Technical Contract

### Data Models

```ts
// Record served by data-plane for one account. Absent record == { mode: 'off' }.
interface CspSettings {
  schemaVersion: 1
  storeId: string
  mode: 'off' | 'report-only' | 'enforce'
  frameAncestors?: {
    mode: 'off' | 'report-only' | 'enforce'   // defaults to `mode`
    sources: string[]                          // appended to the default 'self', e.g. ["https://{account}.myvtex.com"]
  }
  extraSources?: Partial<Record<CspDirective, string[]>>  // appended to the baseline, per directive
  reportEndpoint?: string                      // default: https://endpointcsp.vtex.com/api/report
  updatedAt: string                            // ISO 8601, informational
  version: number                              // monotonic, informational
}

type CspDirective =
  | 'default-src' | 'script-src' | 'style-src' | 'img-src' | 'font-src'
  | 'connect-src' | 'frame-src' | 'worker-src' | 'form-action'
  | 'object-src' | 'base-uri'

// Output of the builder.
interface CspHeaders {
  'Reporting-Endpoints': string
  'Content-Security-Policy'?: string
  'Content-Security-Policy-Report-Only'?: string
}
```

Validation rules applied by the builder (invalid entries are dropped and logged):
- `extraSources` values must be `'self'`, `'none'`, `data:`, `blob:`, or an `https://` origin with optional single leading wildcard label.
- `'unsafe-inline'`, `'unsafe-eval'`, `'unsafe-hashes'`, `http:` and bare `*` are rejected from data.
- `frameAncestors.sources` follows the same rule and is appended to the default `'self'`.
- `'none'` is dropped from a directive that has other sources.
- The built header is capped at 8192 bytes.

### Baseline (code)

Derived from what `packages/core/src` loads today. `{account}` is replaced with `storeConfig.api.storeId`. Security confirms the first-party host list before enforce.

| Directive | Sources | Reason |
|---|---|---|
| `default-src` | `'self'` | |
| `script-src` | `'self'` `'unsafe-inline'` `'unsafe-eval'` `https://io2.vtex.com` `https://activity-flow.vtex.com` `https://www.googletagmanager.com` | inline bootstraps in `_document.tsx` and `ThirdPartyScripts/vtex.tsx`; Partytown worker; GTM |
| `worker-src` | `'self'` `blob:` | Partytown |
| `connect-src` | `'self'` `https://sp.vtex.com` `https://{account}.myvtex.com` `https://{account}.vtexcommercestable.com.br` `https://{account}.vtexcommercebeta.com.br` `https://www.google-analytics.com` `https://analytics.google.com` `https://www.googletagmanager.com` | search analytics; redirects evaluate; VTEX scripts and merchant code; GA via GTM |
| `img-src` | `'self'` `data:` `blob:` `https://{account}.vtexassets.com` `https://www.googletagmanager.com` `https://www.google-analytics.com` | image loader; GTM pixels |
| `style-src` | `'self'` `'unsafe-inline'` `https://fonts.googleapis.com` | Next.js inline styles; default `WebFonts.tsx` |
| `font-src` | `'self'` `data:` `https://fonts.gstatic.com` | default fonts |
| `frame-src` | `'self'` `https://{account}.myvtex.com` `https://{account}.vtexcommercestable.com.br` `https://{account}.vtexcommercebeta.com.br` | checkout and login hosts |
| `form-action` | `'self'` same three VTEX hosts as `frame-src` | checkout, login, logout navigations |
| `object-src` | `'none'` | |
| `base-uri` | `'self'` | |
| `frame-ancestors` | `'self'` plus `frameAncestors.sources` | Headless CMS preview runs on `preview.vtex.app` and is covered by `'self'`; other hosts come from data and are appended |

The optional Shopping Assistant (`https://cdn.cloud.weni.ai`, v4 only) is **not** in the baseline. Accounts that enable it add it through `extraSources`.

### Interfaces

```ts
// data-plane-api.ts
export function cspSettingsUrl(storeId: string): URL
// GET {DATA_PLANE_API_URL}/api/v1/csp/settings?storeId={storeId}
// 200 → CspSettings JSON; 404 → no record (treated as mode: off); other → failure (fail open)
// Response SHOULD carry Cache-Control: max-age=60 so intermediate caches align with the client TTL.

// settings-client.ts
export interface SettingsClient {
  get(storeId: string): Promise<CspSettings | null>   // never throws
}
export function createSettingsClient(opts?: {
  ttlMs?: number; staleMs?: number; timeoutMs?: number; fetchImpl?: typeof fetch
}): SettingsClient
// After a failed call, no new call for that store for FAILURE_RETRY_MS (60 s), whatever ttlMs is.

// policy-builder.ts
export function buildCspHeaders(
  baseline: Baseline,
  settings: CspSettings,
  storeId: string
): CspHeaders | null          // null when mode and frameAncestors.mode are both 'off'

// csp-service.ts
export class CspService {
  constructor(client?: SettingsClient)
  apply(response: NextResponse, storeId: string): Promise<NextResponse>  // mutates and returns the same response
}
```

Header shapes:

```
Reporting-Endpoints: csp-endpoint="https://endpointcsp.vtex.com/api/report?account={account}"

Content-Security-Policy-Report-Only: default-src 'self'; script-src ...; ...;
  report-uri https://endpointcsp.vtex.com/api/report?account={account}; report-to csp-endpoint

Content-Security-Policy: frame-ancestors 'self' https://{account}.myvtex.com
```

Environment:

| Variable | Default | Purpose |
|---|---|---|
| `DATA_PLANE_API_URL` | `https://faststore.vtex.com` (same as `WEBOPS_API_URL`) | origin of the settings API |
| `CSP_SETTINGS_TTL_MS` | `60000` | fresh window |
| `CSP_SETTINGS_STALE_MS` | `600000` | stale-on-error window |
| `CSP_SETTINGS_TIMEOUT_MS` | `500` | per-call timeout |

### Integration Points

- **`data-plane`**: `GET /api/v1/csp/settings?storeId={account}`. Owner of the record, the Product Support toggle and the audit log. Out of scope here beyond the read contract.
- **CSP report service**: `https://endpointcsp.vtex.com/api/report`. Receives `application/csp-report` (from `report-uri`) and `application/reports+json` (from `report-to`). The account id travels in the query string.
- **Password protection**: `PasswordProtectionService` runs first; CSP applies only to its pass-through result.
- **Localization (v4)**: `localizationRewrite()` result is the response that gets the headers.
- **CloudFront**: caches HTML with its headers. Mode changes at the origin propagate to shoppers after the CDN TTL or an invalidation. The RFC's "rollback in minutes" condition during the freeze is met by the CloudFront layer, not by this mechanism alone.
- **Lighthouse CI**: `csp-xss` stays off until an enforced baseline exists on the CI store.

### Invariants & Constraints

- The store MUST serve pages when `data-plane` is unreachable. No CSP code path may throw into the middleware.
- The builder MUST be pure and deterministic: same inputs, same header string, for test snapshots and for diffing between accounts.
- Data MUST NOT be able to weaken the baseline: no removal of baseline sources, no `'unsafe-*'` keywords, no `http:` origins, no bare `*`.
- CSP headers MUST NOT be set on redirects, on `NextResponse.error()`, or on the password unlock flow.
- The matcher in `proxy.ts` / `middleware.ts` MUST NOT change as part of this work.
- Shared code under `src/server/csp/` MUST run on the Edge runtime (v3) and on Node (v4) without branches.
- No new runtime dependency in `@faststore/core`.
- Any change to this mechanism requires the explicit human approval line in the PR description required by root `AGENTS.md`.

### Open Questions

1. Final path of the `data-plane` settings endpoint on the WebOps origin, and whether the read needs an auth header.
2. Whether `data-plane` triggers a CloudFront invalidation on mode change, or the CloudFront function layer owns the kill switch for the Black Friday window.
3. Whether the Partytown worker needs `'unsafe-eval'` in `worker-src` as well as `script-src`. To be confirmed with Report-Only data on a v3 and a v4 store.
