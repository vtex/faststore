---
id: overview
---

# Usage 

## Installation

From the command line in your project directory, run npm install `@faststore/ui` or yarn add `@faststore/ui`.

```cmd
npm install @faststore/ui
# or
yarn add @faststore/ui
```

For style, you can use our default theme. To install:

```cmd
npm install @vtex/theme-b2c-tailwind
# or
yarn add @vtex/theme-b2c-tailwind
```

## Usage

```tsx
import { Button } from '@faststore/ui'
import '@vtex/theme-b2c-tailwind/dist/index.css'
```

```tsx
import React, { Component } from 'react'

import MyComponent from '@faststore/ui'

class Example extends Component {
  render() {
    return <MyComponent />
  }
}
```