# FastStore SDK

FastStore SDK provides tools that help you deal with key ecommerce features:

- [Shopping cart](#shopping-cart)
- [Session](#session)
- [Search](#search)
- [Analytics](#analytics)

Note that the SDK manages these aspects of your store in the context of shoppers' browsers. This means, for example, that functions related to cart and session, do not necessarily send requests to the [FastStore API](https://www.faststore.dev/reference/api/faststore-api). In this case, the goal is to manage information in the browser, that can then be compared to information in the platform with the appropriate [mutations](https://www.faststore.dev/reference/api/mutations).

Below you can learn more about how each of the main SDK features.

## shopping cart

## Session

## Search

## Analytics

The analytics module helps you create a simple and extensive event system to feed your data pool. It is biased towards Google Analytics 4 but supports any other analytics provider. Go to the [Analytics](/reference/sdk/analytics) page to learn more.

## Get started

### Installation

Install `@faststore/sdk` as a dependency of your FastStore project via the command line:

```bash
yarn add @faststore/sdk
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
