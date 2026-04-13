# FastStore My Account Localization — Engineering Specs

*Derived from: FastStore – My Account Vision & Requirements (Localized My Account experience for B2B)*
*Date: 2026-04-13*

---

## REQ1 — Localize native page labels

| Field    | Value          |
|----------|----------------|
| Priority | Must Have      |
| Persona  | B2B Buyer (Shopper) |

### User Story
I, as a B2B Buyer, need to see all native My Account page labels (Menu, Profile, Orders, Order Details, User Details, Security) displayed in my preferred language, so I can navigate and use My Account without needing to understand English.

### Acceptance Criteria
- [ ] Given a B2B Buyer is using My Account in FastStore, when the interface loads any native page (Menu, Profile, Orders, Order Details, User Details, Security), then all labels on that page are displayed in either English (en-US) or Portuguese (pt-BR), as these are the only two languages available in the first version.

### Notes
i18n implementation must use `react-intl` as the localization library.

---

## REQ1.1 — Exclude already-localized fields

| Field    | Value          |
|----------|----------------|
| Priority | Must Have      |
| Persona  | B2B Buyer (Shopper) |

*Sub-requirement of REQ1.*

### User Story
I, as a B2B Buyer, need the localization to exclude fields already translated by other systems (currency, payment method name, order fields), so the interface remains consistent and avoids conflicting translations.

### Acceptance Criteria
- [ ] Given a B2B Buyer is viewing any native My Account page that contains fields sourced from external systems (such as currency, payment method name, and order fields), when the page renders in any supported locale, then those fields must be displayed exactly as returned by the external system, with no transformation or translation applied by My Account.

---

## REQ2 — Locale selector component in header

| Field    | Value          |
|----------|----------------|
| Priority | Must Have      |
| Persona  | B2B Buyer (Shopper) |

### User Story
I, as a B2B Buyer, need to see a locale selector component in the My Account header that lets me manually switch between English (en-US) and Portuguese (pt-BR), so I can control which language the interface is displayed in.

### Acceptance Criteria
- [ ] Given a B2B Buyer is on any My Account page and sees the locale selector in the header, when they select either English (en-US) or Portuguese (pt-BR) from the component, then all content on the current page is immediately re-rendered in the selected language, and the selection is persisted in local storage or session storage so it carries over across subsequent page navigations.

### Notes
i18n implementation must use `react-intl` as the localization library.

---

## REQ3 — Persist locale preference in storage

| Field    | Value          |
|----------|----------------|
| Priority | Must Have      |
| Persona  | B2B Buyer (Shopper) |

### User Story
I, as a B2B Buyer, need my locale preference to be read from and saved to session or local storage, so that my selected language persists across page navigations during my session.

### Acceptance Criteria
- [ ] Given a B2B Buyer opens any My Account page for the first time (no locale stored yet), when the page renders, then the default locale is set to Portuguese (pt-BR) and stored in local storage or session storage.
- [ ] Given a B2B Buyer has already selected a locale via the locale selector, when they navigate to any other My Account page, then the locale stored in local storage or session storage is read and applied, so the previously selected language is preserved.

---

## REQ5 — Fallback to English for unmapped locales

| Field    | Value          |
|----------|----------------|
| Priority | Must Have      |
| Persona  | B2B Buyer (Shopper) |

### User Story
I, as a B2B Buyer, need the interface to fall back to English when my selected locale is not mapped in the repository, so I always see a fully rendered interface rather than missing or broken labels.

### Acceptance Criteria
- [ ] Given a specific interface element or component has no translation mapped for the active locale, when that element renders, then it falls back and displays in English, rather than showing a missing or broken label.
- [ ] Given a B2B Buyer has a locale selected that is not mapped in the repository, when any My Account page or component renders, then the entire interface is presented in English as the default fallback language.

### Notes
i18n implementation must use `react-intl` as the localization library. The fallback locale must be configured as `en-US` in the `react-intl` provider setup.

---
