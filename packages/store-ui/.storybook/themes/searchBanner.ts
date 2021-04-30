import type { ThemeUIStyleObject } from 'theme-ui'

export const searchBannerTheme: ThemeUIStyleObject = {
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
