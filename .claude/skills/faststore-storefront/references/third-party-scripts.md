---
name: faststore-third-party-scripts
description: How to inject third-party scripts, meta tags, and head content into a FastStore storefront. Use when adding external scripts (pixel tags, chat widgets, A/B testing tools), site verification meta tags, Google Tag Manager snippets, or any other content that needs to be in the HTML document head.
metadata:
  author: vtex
  version: "1.0"
---

# FastStore Third-Party Scripts

## Overview

The file `src/scripts/ThirdPartyScripts.tsx` exports a component that gets automatically injected into the document `<head>` by FastStore Core.

Scripts are injected in a worker thread **asynchronously** using the `@builder.io/partytown` library to prevent blocking the main render thread.

## File Location

```
src/scripts/ThirdPartyScripts.tsx
```

This file is automatically picked up by FastStore CLI and injected into the document head during build. You do not need to import or reference it manually.

## Usage

Export a default React component that returns any JSX valid inside `<head>`:

```tsx
// src/scripts/ThirdPartyScripts.tsx

const ThirdPartyScripts = () => {
  return (
    <>
      {/* Site verification meta tag */}
      <meta
        name="google-site-verification"
        content="your-verification-token-here"
      />

      {/* Custom script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.myThirdPartyLib = window.myThirdPartyLib || {};
          `,
        }}
      />
    </>
  );
};

export default ThirdPartyScripts;
```

## Common Use Cases

### Site Verification Tag

```tsx
const ThirdPartyScripts = () => (
  <meta
    name="google-site-verification"
    content="xRwnzq5B91_3hXsAxoKXfxRwMWk2wsaNwInIjiibTx0"
  />
);

export default ThirdPartyScripts;
```

### Multiple Head Elements

```tsx
const ThirdPartyScripts = () => (
  <>
    <meta name="google-site-verification" content="..." />
    <meta name="facebook-domain-verification" content="..." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
  </>
);

export default ThirdPartyScripts;
```

## Notes

- **Google Tag Manager** does not need to be added here — it is configured via `discovery.config.js` using `analytics.gtmContainerId` and injected automatically by FastStore Core.
- The component renders into `<head>`, so only elements valid in `<head>` should be returned.
- Scripts run in a Partytown worker thread, which means they are sandboxed from the main thread for performance. Ensure any third-party scripts you add are compatible with this approach.
