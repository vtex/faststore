---
name: faststore-cms
description: How VTEX Headless CMS integrates with FastStore, including how to define section schema.json and sync them. Use when registering new CMS sections, defining editable CMS fields (text, boolean, dropdown, nested objects), syncing schema changes, or understanding how CMS props flow to React components.
metadata:
  author: vtex
  version: "1.0"
---

# FastStore CMS Integration

## Overview

The `cms/faststore/schema.json` file defines final JSON schemas for all storefront CMS data

**All global native sections are already registered** — `schema.json` must not change it manualy.

To edit content in existing global sections, use the Store Admin at:
`https://{store-id}.myvtex.com/admin` → `Storefront` → `Content: All content`

## Critical Rules

1. There is no need of creating `cms/faststore/pages/*.jsonc` files for new sections. This should be edited only when a new landing page is needed.
2. After every change to `cms/faststore/components/*.jsonc` or `cms/faststore/pages/*.jsonc`, must execute final schema generation and upload it to the cms admin app.
3. Every file inside the folder `cms/faststore/components/` should follow this name pattern and extension: `cms_component__<name>.jsonc`

## Schema Format

```jsonc
  {
    "$extends": [
      "#/$defs/base-component"
    ],
    "$componentKey": "CustomIconsAlert",
    "$componentTitle": "CustomIconsAlert",
    "type": "object",
    "required": ["icon", "content", "dismissible"],
    "properties": {
      "icon": {
        "type": "string",
        "title": "Icon",
        "enumNames": ["Bell", "BellRinging", "Checked", "Info", "Truck", "User", "Storefront"],
        "enum":      ["Bell", "BellRinging", "Checked", "Info", "Truck", "User", "Storefront"]
      },
      "content": {
        "type": "string",
        "title": "Content"
      },
      "link": {
        "title": "Link",
        "type": "object",
        "properties": {
          "text": { "type": "string", "title": "Link Text" },
          "to":   { "type": "string", "title": "Action link" }
        }
      },
      "dismissible": {
        "type": "boolean",
        "default": false,
        "title": "Is dismissible?"
      }
    }
  }
```

## Schema Rules

| Rule | Detail |
|------|--------|
| `"$componentKey"` | **Must** match a key exported from `src/components/index.tsx` |
| `"name"` | **Must** match a key exported from `src/components/index.tsx` |
| Properties | Become the section's props passed to the React component |
| `"enum"` + `"enumNames"` | Renders a dropdown in the CMS editor |
| `"type": "boolean"` | Renders a toggle |
| `"type": "object"` | Creates a nested group of fields |
| `"required"` | Array of field names that must be filled by the editor |

## CMS Section Registration Workflow

1. **Define the schema** in `cms/faststore/components/cms_component__<Name>.jsonc`
2. **Create the React component** in `src/components/sections/<Name>/`
3. **Register the component** in `src/components/index.tsx` with the same key as the schema `"$componentKey"` field
4. **Run `vtex content generate-schema cms/faststore/components cms/faststore/pages -o cms/faststore/schema.json -b vtex.faststore4`** to generate final schema file.
5. **Run `vtex content upload-schema cms/faststore/schema.json`** to push final schema file to cms.
6. The section is now available to editors in the CMS admin

## Section Scopes

Sections can be scoped to specific page types using `"requiredScopes"`:

```json
{
  "$extends": [
    "#/$defs/base-component"
  ],
  "$componentKey": "QuickFilter",
  "$componentTitle": "QuickFilter",
  "requiredScopes": ["plp", "search"],
  "type": "object",
  "description": "Quick Filter section for search pages",
  "required": [],
  "properties": {}
}
```

## Generate final schema.json file

To generate the final schema `cms/faststore/schema.json` the following command must be executed

```bash
  vtex content generate-schema -o cms/faststore/schema.json -b vtex.faststore4
```

To upload the final schema to the CMS admin app:

```bash
  vtex content upload-schema cms/faststore/schema.json
```

LLMs can use the following script to upload the final schema to the CMS admin app: 

```bash
  expect -c 'spawn vtex content upload-schema cms/faststore/schema.json; expect "store ID"; send "faststore\r"; expect "uploaded with"; send "y\r"; expect "Are you sure"; send "y\r"; expect eof' 2>&1;
```

This pushes schema changes to VTEX CMS. Without this step, new sections will not appear in the CMS editor.

## Important: No Props to CMS Sections

**Every CMS Section must read all data it needs from Contexts or via BFF requests.** No props are ever passed directly to new CMS sections — data always comes from either:
- Page context hooks (`usePDP()`, `usePLP()`, `usePage()`, etc.)
- Custom GraphQL queries via `useQuery` / `useLazyQuery`