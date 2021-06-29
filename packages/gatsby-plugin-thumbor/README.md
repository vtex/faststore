# gatsby-plugin-thumbor

A plugin for integrating gatsby-plugin-image with [thumbor](http://thumbor.org/), an open-source smart on-demand image cropping, resizing and filters, so you can make your own smart image handling service.

## Install
```
yarn add @vtex/gatsby-plugin-thumbor gatsby-plugin-image
```

## How to use 
For using this plugin, you will need to add both `gatsby-plugin-image` and `gatsby-plugin-thumbor` to your `gatsby-config.js`.
```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    // other plugins ...
    {
      resolve: 'gatsby-plugin-image'
    },
    {
      resolve: `@vtex/gatsby-plugin-thumbor`
      options: {
        // Your thumbor server url
        server: 'https://mythumborserver.com',
      }
    }
  ],
}
```
Then, in your react component you can simply use the hooks exported by `gatsby-plugin-thumbor` with the components exported by `gatsby-plugin-image`

```tsx
// In your React component
import React, { FC } from 'react'
import { useThumborImageData } from '@vtex/gatsby-plugin-thumbor'
import { GatsbyImage } from 'gatsby-plugin-image'

const MyComponent: FC = () => {
  const image = useThumborImageData({
    baseUrl: 'http://example.org/image.jpg',
    options: {
      // ...other thumbor options
      fitIn: true,
    }
  })

  return <GatsbyImage alt="example image" image={image} />
}
```

## How it works
Thumbor is an image processing service that enables you to process any image on the web. According to `gatsby-plugin-image` documentation, thumbor is a URL-based image optimization service. This means that, for processing an image, we only need to generate an URL with the right parameters, and thumbor will do the heavy lifting for us.

A thumbor compatible URL can be split into two sections. The first one is a thumbor specific URL with parameters for image resizing, postprocessing, etc, and a second section containing a data source where thumbor must fetch the original image from. To illustrate. Let's suppose your thumbor service is located at `mythumborserver.com` domain and that you need to resize to 250px/250px an image located at `example.com/image.png`. To resize `image.png` you can do the following request:
```
GET https://mythumborserver.com/unsafe/250x250/http://example.com/image.png
```
The aforementioned request returns the processed image. `gatsby-plugin-image` uses this URL in HTML's `img` tag elements to add images to the final HTML.

As mentioned before, Thumbor has lots of different parameters that tell it how to process and convert images. `gatsby-plugin-thumbor` tightly integrates with `gatsby-plugin-image` to give you control over these parameters in a simple interface, while generating a thumbor compatible URLs. The interface chosen is the extra `options` parameters in `gatsby-plugin-image` functions.

## Securing your thumbor service
You may now be wondering why there is an `/unsafe` segment in thumbor's generated URL. This is because thumbor accepts requests from anyone on the internet to process and resize images. This makes the thumbor service prone to DDoS attacks.
 
Thumbor has a solution for this on their docs. They say you should sign the URLs so the thumbor service knows when an image is from a reliable source or if it's someone messing with your server. This is the best way for protecting your thumbor server. 

However, this plugin offers an alternative to this solution. 
Usually, when serving gatsby, you are using a CDN (`gatsby-plugin-netlify`) or Nginx (`@vtex/gatsby-plugin-nginx`). These services can be used as a reverse proxy server. Adding a reverse proxy to your thumbor service may protect it from malicious users because then we can only allow a small subset of all possible transformations to your images, decreasing the attack space on your thumbor service. 
This protection is achieved with two parameters accepted by the plugin, `sizes` and `basePath`. A config using these parameters looks like this:
```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    // other plugins ...
    {
      resolve: 'gatsby-plugin-image'
    },
    {
      resolve: `@vtex/gatsby-plugin-thumbor`
      options: {
        // Your thumbor server url
        server: 'https://mythumborserver.com',
        basePath: '/images',
        sizes: [
          '1080x1080',
          '720x720',
        ]
      }
    }
  ],
}
```

Now, instead of creating URLs like `https://mythumborserver.com/unsafe/1080x1080/http://example.com/image.png`, the plugin will create URLs for `{basePath}/1080x1080/http://example.com/image.png`, serve thumbor images on the same domain as your site, and will only allow resizing to 1080x1080 and 720x720 images.

Behind the scenes, what this plugin is doing is calling a `createRedirect` function between `/{basePath}/{size} => https://mythumborserver.com/unsafe/{size}` 

## Examples
Aside from `useThumborImageData`, this plugin exports `useUrlBuilder`, `useGetThumborImageData`, `getThumborImageData` and `urlBuilder`. These functions are thin wrappers to their counterparts on `gatsby-plugin-image` only adding the plugin's options, like the thumbor server URL. You can use them normally in your react code. For instance, if you need the `getImageData` function you can:
```tsx
// In your React component
import React, { FC } from 'react'
import { useGetThumborImageData } from '@vtex/gatsby-plugin-thumbor'
import { GatsbyImage, withArtDirection } from 'gatsby-plugin-image'

const MyComponent: FC = () => {
  // gatsby-plugin-image's getImageData function
  const getImageData = useGetThumborImageData()
  const img1 = getImageData({baseUrl: 'http://example.org/img1.jpg'})
  const img2 = getImageData({baseUrl: 'http://example.org/img2.jpg'})

  // The images are totally compatible with gatsby-plugin-image
  const image = withArtDirection(img1, {
    media: '(max-width: 40em)',
    image: img2
  })

  return <GatsbyImage alt="example image" image={image} />
}
```

## How to contribute
Feel free to open issues in our repo. Also, there is a general contributing guideline in there
