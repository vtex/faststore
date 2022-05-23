import { forwardRef, memo } from 'react'
import Head from 'next/head'

import { useImage } from './useImage'
import type { ImageOptions } from './useImage'

// React still don't have imageSizes declared on its types. Somehow,
// it generated the right html
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    imageSizes?: string
    fetchPriority?: string
  }
}

interface Props extends ImageOptions {
  preload?: boolean
}

// TODO: Replace this component by next/image
const Image = forwardRef<HTMLImageElement, Props>(
  ({ preload = false, fetchPriority, ...otherProps }, ref) => {
    const imgProps = useImage(otherProps)
    const { src, sizes = '100vw', srcSet } = imgProps

    return (
      <>
        {preload && (
          <Head>
            <link
              as="image"
              rel="preload"
              href={src}
              imageSrcSet={srcSet}
              imageSizes={sizes}
              fetchPriority={fetchPriority}
            />
          </Head>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={ref}
          data-store-image
          {...imgProps}
          alt={imgProps.alt}
          fetchPriority={fetchPriority}
        />
      </>
    )
  }
)

Image.displayName = 'Image'
export default memo(Image)
