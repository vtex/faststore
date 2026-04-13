# Implementation Plan: MyAccount Internationalization

**Spec source:** `sdd/specs/specs.md`
**Created:** 2026-04-12
**Status:** Completed

---

## Steps

- [x] **Step 1:** Add `react-intl` to `packages/core` dependencies
  - Files: `packages/core/package.json`
  - Details: Added `"react-intl": "^6.8.9"` to dependencies (v10.x requires React 19; project uses React 18)

- [x] **Step 2:** Create locale message files
  - Files:
    - `packages/core/src/components/account/i18n/messages/en-US.json`
    - `packages/core/src/components/account/i18n/messages/pt-BR.json`
  - Details: All static UI strings for both locales. External API data (currency, payment method names, order data) excluded per REQ1.1.

- [x] **Step 3:** Create `useMyAccountLocale` hook
  - Files: `packages/core/src/components/account/i18n/useMyAccountLocale.ts`
  - Details: Reads from `localStorage` key `'faststore-my-account-locale'`. Defaults to `'pt-BR'` (REQ3). Exposes `{ locale, setLocale }`.

- [x] **Step 4:** Create `MyAccountIntlProvider` component
  - Files: `packages/core/src/components/account/i18n/MyAccountIntlProvider.tsx`
  - Details: Wraps `<IntlProvider>` with `defaultLocale="en-US"` (REQ5). Exposes locale context via `useLocaleContext()`.

- [x] **Step 5:** Integrate `MyAccountIntlProvider` into `MyAccountLayout`
  - Files: `packages/core/src/components/account/MyAccountLayout/MyAccountLayout.tsx`
  - Details: All MyAccount pages covered without touching `_app.tsx`.

- [x] **Step 6:** Create `LocaleSelector` component
  - Files: `packages/core/src/components/account/i18n/LocaleSelector.tsx`
  - Details: `<select>` with en-US / pt-BR options. Uses `useLocaleContext` to read/set locale.

- [x] **Step 7:** Update `MyAccountHeader` to render `LocaleSelector`
  - Files: `packages/core/src/components/account/components/MyAccountHeader/MyAccountHeader.tsx`

- [x] **Step 8:** Update `getMyAccountRoutes` to use message IDs
  - Files: `packages/core/src/sdk/account/getMyAccountRoutes.ts`
  - Details: Route titles changed to message ID strings, translated in `MyAccountMenu`.

- [x] **Step 9:** Update `MyAccountMenu` to translate nav item titles and Switch button
  - Files: `packages/core/src/components/account/MyAccountMenu/MyAccountMenu.tsx`

- [x] **Step 10:** Migrate `profile` component to react-intl
  - Files: `packages/core/src/components/account/profile/profile.tsx`, `i18n.ts`

- [x] **Step 11:** Translate `SecuritySection` labels
  - Files: `packages/core/src/components/account/security/SecuritySection.tsx`

- [x] **Step 12:** Translate `MyAccountListOrders` labels
  - Files: `packages/core/src/components/account/orders/MyAccountListOrders/MyAccountListOrders.tsx`

- [x] **Step 13:** Translate `MyAccountUserDetails` labels
  - Files: `packages/core/src/components/account/MyAccountUserDetails/MyAccountUserDetails.tsx`

- [x] **Step 14:** Translate Order Details static labels
  - Files: All components in `packages/core/src/components/account/orders/MyAccountOrderDetails/`

---

## Verification

- [ ] `pnpm lint` passes
- [ ] No TypeScript errors
- [ ] MyAccount pages render in Portuguese (pt-BR) on first load
- [ ] Switching locale via selector re-renders page immediately
- [ ] Refreshing page after selecting en-US keeps English
- [ ] Currency, payment method names, API order data values are NOT translated
- [ ] For missing translation key, English (en-US) fallback is shown
