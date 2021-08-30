# @vtex/store-ui

> Next store component library

[![NPM](https://img.shields.io/npm/v/@vtex/store-ui.svg)](https://www.npmjs.com/package/@vtex/store-ui) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Installation

From the command line in your project directory, run npm install `@vtex/store-ui` or yarn add `@vtex/store-ui`.

```cmd
npm install @vtex/store-ui
# or
yarn add @vtex/store-ui
```

For style, you can use our default theme. To install:

```cmd
npm install @vtex/theme-b2c-tailwind
# or
yarn add @vtex/theme-b2c-tailwind
```

## Usage

```tsx
import { Button } from '@vtex/store-ui'
import '@vtex/theme-b2c-tailwind/dist/index.css'
```

```tsx
import React, { Component } from 'react'

import MyComponent from '@vtex/store-ui'

class Example extends Component {
  render() {
    return <MyComponent />
  }
}
```

## License

MIT © [emersonlaurentino](https://github.com/emersonlaurentino)
