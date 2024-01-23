const DEFAULT_WIDTH_PX = 80
const DEFAULT_HIGH_DENSITY_FACTOR = 1

const baseUrlRegex =
  /.+\/ids\/(?<imageId>\d+)(?:-(?<imageWidth>\d+)-(?<imageHeight>\d+)|)\//

const sizeRegex = /-(?<width>\d+)-(?<height>\d+)/

function cleanImageUrl(imageUrl: string) {
  const matches = imageUrl.match(baseUrlRegex)

  if (matches == null || !matches.groups) {
    return undefined
  }

  if (
    matches.groups.imageWidth !== undefined ||
    matches.groups.imageHeight !== undefined
  ) {
    return matches[0].replace(sizeRegex, '')
  }

  return matches[0]
}

function replaceHttpWithRelativeProtocol(url: string) {
  return url.replace(/^https?:\/\//, '//')
}

function changeImageUrlSize(
  url: string | undefined,
  {
    screenDensityFactor = DEFAULT_HIGH_DENSITY_FACTOR,
    width = DEFAULT_WIDTH_PX,
  } = {}
) {
  if (!url) {
    return undefined
  }

  const resultWidth = width * screenDensityFactor

  const resizedImageUrl = url.replace(/\/$/, '')

  return {
    src: `${resizedImageUrl}-${resultWidth}-auto`,
    width: resultWidth,
    densityFactor: screenDensityFactor,
  }
}

function getImageSrcSets(imageUrl?: string) {
  if (!imageUrl) {
    return
  }

  const cleanUrl = cleanImageUrl(replaceHttpWithRelativeProtocol(imageUrl))

  const [at1x, at2x, at3x] = [1, 2, 3].map((densityFactor) =>
    changeImageUrlSize(cleanUrl, { screenDensityFactor: densityFactor })
  )

  if (!at1x || !at2x || !at3x) {
    return
  }

  return [at1x, at2x, at3x]
}

export type ProductImageProps = {
  src: string
  alt: string
  'aria-labelledby'?: string
}

export function ProductImage({ src, alt, ...props }: ProductImageProps) {
  const srcsets = getImageSrcSets(src)

  return (
    <div
      className="relative flex justify-center p-2"
      style={{ height: '3rem', width: '3rem' }}
    >
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="object-contain"
          src={replaceHttpWithRelativeProtocol(src)}
          alt={alt}
          loading="lazy"
          srcSet={srcsets
            ?.map(
              ({ src: currentSrc, densityFactor }) =>
                `${currentSrc} ${densityFactor}x`
            )
            .join(', ')}
          aria-labelledby={props['aria-labelledby']}
        />
      )}
      <div className="pointer-events-none absolute inset-0 rounded bg-black opacity-5" />
    </div>
  )
}
