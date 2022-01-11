# Dynamic Content

Static Site Generation (SSG) is awesome because of the performance and stability it offers. However, an ecommerce is much more than a static product catalog. Ecommerces offer the possibility of creating a personalized experience for the final customer by offering personalized prices, availability and search results.
This level of customization used to be really difficult to achieve in a static website. However, with the advancements of React, it's possible now to use hybrid rendering techniques to create custom digital experiences for your customer.

## Hybrid rendering
React has basically two rendering modes. Server-Side Rendering (SSR) and Client-Side Rendering (CSR). SSR runs on the server while CSR is executed by the customer's browser. You can use both modes together to render the skeleton of the page on the server and fill the gaps on the client. This method of using both rendering modes complementary is called hybrid rendering. Below, you can see this great animation from the Gatsby website of how the page would load on the user's browser using hybrid rendering:

  ![Gastby hybrid rendering animation](https://user-images.githubusercontent.com/1753396/146009746-3e67daa8-4c98-4525-96e2-76958c085695.gif)

### Hybrid rendering in ecommerce
The rule of thumb for creating highly customizable ecommerce experiences is to render everything that is common to all users on the server, while deferring custom data, like product prices, availability and search results to the client for CSR. 

## Creating a Product Detail Page (PDP)
CSR and SSR are highly dependent on the framework you are using. Below you will find a pseudo-code using GraphQL.
```tsx
import React from 'react'

export const query = `
query PDPQuery ($slug: String!) {
  product (slug: $slug) {
    productName
    image { 
      src
      alt 
    }
    price
  }
}
`

function Page (props) {
  const { product } = props

  return (
    <div>
      <div>{product.name}</div>
      <img src={product.image.src} alt={product.image.alt} />
      <div>Price: {product.price}</div>
    </div>
  )
}

export default Page
```

As you can see, this code renders everything on the server and thus, the price will be the same for everybody.

To add customization, let's use the hook `useQuery`. This hook uses [SWR](https://swr.vercel.app/) under the hood and returns data on the client-only. 
Also, we will use `@faststore/sdk` to retrieve info about the user so we can call the API with the user's `channel` data.

```tsx
import React from 'react'

export const query = `
query PDPQuery ($slug: String!) {
  product (slug: $slug) {
    productName
    image { 
      src
      alt 
    }
  }
}
`

function Page (props) {
  const { product, slug } = props
  const { channel } = useSession()
  const { data, isRevalidating } = useQuery(`
    query DynamicProductQuery(slug: $slug, channel: $channel) {
      product (slug: $slug, channel: $channel) {
        price
      }
    }
  `, { channel, slug })

  return (
    <div>
      <div>{product.name}</div>
      <img src={product.image.src} alt={product.image.alt} />
      {!isRevalidating && <div>Price: {data.product.price}</div>}
    </div>
  )
}

export default Page
```

Now the price will render on the client-side and will depend on the user's channel, allowing customization.
