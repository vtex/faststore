import { forwardRef, memo } from 'react'
import Head from 'next/head'

import { useImage } from './useImage'
import type { ImageOptions } from './useImage'

// React still don't have imageSizes declared on its types. Somehow,
// it generated the right html
declare module 'react' {
  interface ImgHTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    fetchpriority?: string
  }

  interface LinkHTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    imageSizes?: string
    fetchpriority?: string
  }
}

interface Props extends ImageOptions {
  preload?: boolean
  fetchPriority?: string
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
              fetchpriority={fetchPriority}
            />
          </Head>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={ref}
          data-fs-image
          {...imgProps}
          alt={imgProps.alt}
          fetchpriority={fetchPriority}
        />
      </>
    )
  }
)

Image.displayName = 'Image'
export default memo(Image)
