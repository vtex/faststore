# Get started

## Installation

Install `@faststore/ui` as a dependency of your FastStore project via the command line:

```bash npm2yarn
npm install @faststore/ui
```

For styling, you can **optionally** install our default style theme developed with [Tailwind CSS](https://tailwindcss.com/):

```bash npm2yarn
npm install @vtex/theme-b2c-tailwind
```

---

## Usage

Check our references and import the desired components to your page.

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

Check a live and interactive demo of the `Card` component.

```tsx live
<Card>
  <CardImage>
    <img
      alt="A vintage camera"
      src="https://storecomponents.vtex.app/assets/fit-in/480x480/center/middle/https%3A%2F%2Fstorecomponents.vtexassets.com%2Farquivos%2Fids%2F155481%2FFrame-3.jpg%3Fv%3D636793814536230000"
    />
  </CardImage>
  <CardContent>
    <h3>
      Vintage Top Camera
    </h3>
    <div>
      <Price
        style={{
          textDecoration: 'line-through'
        }}
        value={89.9}
        variant="selling"
      />
      <Price
        value={68.9}
        variant="selling"
      />
    </div>
    <Badge>
      15% OFF
    </Badge>
  </CardContent>
  <CardActions>
    <Button onClick={function noRefCheck(){}}>
      Add to Cart
    </Button>
  </CardActions>
</Card>
```