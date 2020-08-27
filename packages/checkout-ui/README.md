# @vtex/checkout-ui

> Next checkout component library

[![NPM](https://img.shields.io/npm/v/@vtex/checkout-ui.svg)](https://www.npmjs.com/package/@vtex/checkout-ui) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Installation

```bash
yarn add @vtex/checkout-ui
```

## Usage

```tsx
import React, { Component } from 'react'

import { useOrderForm } from '@vtex/checkout-ui'

const Example = () => {
  const { orderForm } = useOrderForm()

  return <p>{orderForm.id}</p>
}
```

## License

MIT © [VTEX](https://www.vtex.com/)
