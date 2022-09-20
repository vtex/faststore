# Getting started with the FastStore SDK

## Installation

Install `@faststore/sdk` as a dependency of your FastStore project via the command line:

```bash
yarn add @faststore/sdk
```

## Usage

The FastStore SDK makes available different functions that help you manage key [ecommerce features](/reference/sdk/faststore-sdk). To use them, simply import them from `@faststore/sdk`.

Below you can see a generic example of how to import and use a hypothetic SDK hook called `useHook`.

```tsx
import React from 'react'
import type { FC } from 'react'

import { useHook } from '@faststore/sdk'

const MyStoreComponent: FC = () => {
  const props = useHook()

  return <MyComponent props>Hello Commerce</MyComponent>
}
```
