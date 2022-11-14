# Getting started with the FastStore SDK

## Installation

Install `@faststore/sdk` as a dependency of your FastStore project via the command line:

```bash
yarn add @faststore/sdk
```

## Usage

The FastStore SDK makes available different functions that help you manage key [ecommerce features](/reference/sdk/faststore-sdk). To use them, import them from `@faststore/sdk`.

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

You can also check browser data managed by the SDK when running your project locally. To do that, follow these steps:

1. Run the command `yarn run develop` on the root of your FastStore project.
2. Go to the local project preview at `http://localhost:3000`.
3. Open the browser's console and run the command `faststore_sdk_stores.get("fs::session").read()` for session data or `faststore_sdk_stores.get("fs::session").read()` for shopping cart data.

:::info
This method only works for checking session and shopping cart browser data. Learn more about the [Analytics](/reference/sdk/analytics) and [Search](/reference/sdk/search) modules.
:::
