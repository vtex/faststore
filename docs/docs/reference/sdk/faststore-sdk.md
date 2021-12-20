# FastStore SDK

:::caution WIP
This documentation is currently under development.
:::

A simple, framework agnostic implementation of Commerce APIs to help you create you next React-based store with world class performance in record time

[![NPM](https://img.shields.io/npm/v/@faststore/sdk.svg)](https://www.npmjs.com/package/@faststore/sdk) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Installation

```bash
yarn add @faststore/sdk
```

## Usage

```tsx
import React from 'react'
import type { FC } from 'react'

import { useHook } from '@faststore/sdk'

const MyStoreComponent: FC = () => {
  const props = useHook()

  return <MyComponent props>Hello Commerce</MyComponent>
}
```

## Analytics

The analytics data layer is based on [the official GA4 specification](https://developers.google.com/gtagjs/reference/ga4-events).

## License

MIT © [VTEX](https://github.com/vtex/faststore)