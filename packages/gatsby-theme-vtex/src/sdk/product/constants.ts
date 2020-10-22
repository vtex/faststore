export const SUMMARY_IMAGE = {
  width: 200,
  height: 200,
  widthStr: '200px',
  heightStr: '200px',
}

export const DETAILS_IMAGE = [
  {
    width: 360,
    height: 360,
    widthStr: '360px',
    heightStr: '360px',
    media: '(max-width: 500px)',
  },
  {
    width: 600,
    height: 600,
    widthStr: '600px',
    heightStr: '600px',
    media: '(min-width: 501px)',
  },
]

export const DETAILS_IMAGES_HEIGHTS = DETAILS_IMAGE.map((x) => x.heightStr)

export const IMAGE_DEFAULT =
  'https://storecomponents.vtexassets.com/assets/faststore/images/product-not-found___29e298d98dd1d0744190f12619653717.jpg'
