# My Account — Optional CMS Schemas

These JSONC files define the CMS component schemas and content-types for the
**FastStore My Account**. They are intentionally kept **outside** of
`cms/faststore/components/` and `cms/faststore/pages/` so that the
`vtex content generate-schema` command **does not** include them in the
FastStore base schema (`schema.json`) published to the Schema Registry.

## Why they live here

The team decided **not** to ship the My Account content-types in the base schema.
This avoids exposing My Account content-types in the CMS Admin of accounts that
do not use the feature (`experimental.enableFaststoreMyAccount: false`), which
would otherwise cause confusion and unnecessary tickets.

The `generate-schema` command scans its target directories **recursively** and
includes any file matching `cms_component__*.jsonc` /
`cms_content_type__*.jsonc`. Keeping these files in a **sibling** folder (not a
subfolder of `components/` or `pages/`) is what keeps them out of the generated
schema.

## Important: storefront still works without these

The storefront does **not** read these JSONC at runtime. My Account pages render
via `ACCOUNT_COMPONENTS` + `fetchMyAccountPageContent` with the TypeScript label
defaults (`*Labels.ts`). Excluding these schemas from the base schema only means
the content-types are **not auto-created in the CMS Admin** — there is no
breaking change to the rendered storefront.

## How a merchant enables My Account in their CMS


## Contents

- `components/` — 14 `cms_component__account*.jsonc` section schemas.
- `pages/` — 6 `cms_content_type__myaccount*.jsonc` content-types.
