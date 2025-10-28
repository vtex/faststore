<p align="center">
  <a href="https://faststore.dev">
    <img alt="Faststore" src="../ui/static/logo.png" width="60" />
  </a>
</p>
<h1 align="center">
  FastStore SDK
</h1>
<p align="center">
  <strong>
    Lightweight ecommerce state managment library
  </strong>
</p>

<div style="display: flex; justify-content: center; width: 100%">
  <a href="https://www.npmjs.com/package/@vtex/faststore-sdk" style="padding: 0px 2px 0px 0px">
    <img src="https://badge.fury.io/js/%40faststore%2Fui.svg" />
  </a>
  <a href="https://bundlephobia.com/package/@vtex/faststore-sdk" style="padding: 0px 2px 0px 2px">
    <img src="https://badgen.net/bundlephobia/minzip/@vtex/faststore-sdk" />
  </a>
  <a href="https://bundlephobia.com/package/@vtex/faststore-sdk" style="padding: 0px 2px 0px 2px">
    <img src="https://badgen.net/bundlephobia/tree-shaking/@vtex/faststore-sdk" />
  </a>
  <a href="https://bundlephobia.com/package/@vtex/faststore-sdk" style="padding: 0px 0px 0px 2px">
    <img src="https://badgen.net/bundlephobia/dependency-count/@vtex/faststore-sdk" />
  </a>
</div>

## Installation

From the command line in your project directory, run pnpm add `@vtex/faststore-sdk`.

```cmd
pnpm add @vtex/faststore-sdk
```

## Usage

```tsx
import React, { Component } from 'react'

import { useUI } from '@vtex/faststore-sdk-internal'

function MyComponent {
  const { displayMinicart } = useUI()

  if (displayMinicart) {
    return <div>Minicart</div>
  }

  return null
}
```

## Docs

For more information, please refer to our documentation: https://v1.faststore.dev/reference/sdk/faststore-sdk
