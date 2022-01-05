# FastStore SDK

:::caution WIP
This documentation is currently under development.
:::

FastStore SDK is a simple, framework-agnostic implementation of Commerce APIs to help you create your next React-based store with world-class performance in record time.

## Key features

### Analytics

The analytics data layer is based on [the official GA4 specification](https://developers.google.com/gtagjs/reference/ga4-events).

##  Get started

### Installation

Install `@faststore/sdk` as a dependency of your FastStore project via the command line:

```bash npm2yarn
npm install @faststore/sdk
```

### Usage

```tsx
import React from 'react'
import type { FC } from 'react'

import { useHook } from '@faststore/sdk'

const MyStoreComponent: FC = () => {
  const props = useHook()

  return <MyComponent props>Hello Commerce</MyComponent>
}
```