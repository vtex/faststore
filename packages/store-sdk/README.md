# @vtex/store-sdk

A simple, framework agnostic implementation of Commerce APIs to help you create you next React-based store with world class performance in record time

[![NPM](https://img.shields.io/npm/v/@vtex/store-sdk.svg)](https://www.npmjs.com/package/@vtex/store-sdk) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add @vtex/store-sdk
```

## Usage

```tsx
import React from 'react'
import type { FC } from 'react'

import { useHook } from '@vtex/store-sdk'

const MyStoreComponent: FC = () => {
  const props = useHook()

  return <MyComponent props>Hello Commerce</MyComponent>
}
```

## License

MIT © [VTEX](https://github.com/vtex/faststore)
