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
  <a href="https://www.npmjs.com/package/@faststore/sdk" style="padding: 0px 2px 0px 0px">
    <img src="https://badge.fury.io/js/%40faststore%2Fui.svg" />
  </a>
  <a href="https://bundlephobia.com/package/@faststore/sdk" style="padding: 0px 2px 0px 2px">
    <img src="https://badgen.net/bundlephobia/minzip/@faststore/sdk" />
  </a>
  <a href="https://bundlephobia.com/package/@faststore/sdk" style="padding: 0px 2px 0px 2px">
    <img src="https://badgen.net/bundlephobia/tree-shaking/@faststore/sdk" />
  </a>
  <a href="https://bundlephobia.com/package/@faststore/sdk" style="padding: 0px 0px 0px 2px">
    <img src="https://badgen.net/bundlephobia/dependency-count/@faststore/sdk" />
  </a>
</div>

## Installation

From the command line in your project directory, run yarn add `@faststore/sdk`.

```cmd
yarn add @faststore/sdk
```

## Usage

```tsx
import React, { Component } from 'react'

import { useUI } from '@faststore/sdk'

function MyComponent {
  const { displayMinicart } = useUI()

  if (displayMinicart) {
    return <div>Minicart</div>
  }

  return null
}
```

## Docs

For more information, please refer to our documentation: https://faststore.dev/reference/sdk/overview
