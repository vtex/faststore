import type { SxStyleProp } from 'theme-ui'

export const searchBannerTheme: SxStyleProp = {
  searchBanner: {
    responsivePicture: {
      picture: {
        display: 'block',
        overflow: 'hidden',
        height: '238px',
      },

      img: {
        width: '100%',
        objectFit: 'cover',
      },
    },
  },
}
