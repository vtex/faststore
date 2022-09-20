# Getting started with the FastStore SDK

## Installation

Install `@faststore/sdk` as a dependency of your FastStore project via the command line:

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
