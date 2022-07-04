# FastStore SDK

:::caution WIP
This documentation is currently under development.
:::

FastStore SDK is a simple, framework-agnostic implementation of Commerce APIs to help you create your next React-based store with world-class performance in record time.

## Key features

### Analytics

The analytics module helps you create a simple and extensive event system to feed your data pool. It is biased towards Google Analytics 4, but supports any other analytics provider. Go to the [Analytics](/reference/sdk/analytics) page to learn more.

## Get started

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
