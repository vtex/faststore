import { createTheme, responsivePictureTheme, SxStyleProp } from '../../src'

const paginationDots: SxStyleProp = {
  container: {
    paddingY: '10px',
    paddingX: 0,
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    margin: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  dot: {
    bg: '#a8a8a8',
    cursor: 'pointer',
    display: 'inline-block',
    borderRadius: '100%',
    margin: '12px 12px 12px 12px',
    padding: '0.25rem',
    borderWidth: 0,
    outline: '0',
    height: `0.725rem`,
    width: `0.725rem`,
  },
  activeDot: {
    bg: 'secondary',
    cursor: 'pointer',
    display: 'inline-block',
    borderRadius: '100%',
    margin: '12px 12px 12px 12px',
    padding: '0.25rem',
    borderWidth: 0,
    outline: '0',
    height: `0.725rem`,
    width: `0.725rem`,
  },
}

const shelfPaginationDots: SxStyleProp = createTheme(paginationDots, {
  container: {
    position: 'relative',
  },
})

const shelfArrows: SxStyleProp = {
  left: {
    button: {
      bg: 'transparent',
      borderColor: 'transparent',
      cursor: 'pointer',

      '&:hover': {
        opacity: '0.5',
      },
    },

    svg: {
      color: 'text',
    },
  },

  right: {
    button: {
      bg: 'transparent',
      borderColor: 'transparent',
      cursor: 'pointer',

      '&:hover': {
        opacity: '0.5',
      },
    },

    svg: {
      color: 'text',
    },
  },
}

const carouselArrows: SxStyleProp = {
  left: {
    button: {
      position: 'absolute',
      top: '50%',
      left: 0,
      zIndex: 1,
      bg: 'transparent',
      borderColor: 'transparent',
      cursor: 'pointer',

      '&:hover': {
        opacity: '0.5',
      },
    },

    svg: {
      color: 'text',
    },
  },

  right: {
    button: {
      position: 'absolute',
      top: '50%',
      right: 0,
      zIndex: 1,
      bg: 'transparent',
      borderColor: 'transparent',
      cursor: 'pointer',

      '&:hover': {
        opacity: '0.5',
      },
    },

    svg: {
      color: 'text',
    },
  },
}

const carouselResponsivePicture = createTheme(responsivePictureTheme, {
  img: {
    height: ['540px', '806px'],
    width: 'auto',
  },
})

const theme: SxStyleProp = {
  productImageGallery: {
    mx: 2,
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',

    miniature: {
      container: {
        mx: '15px',
        width: '78px',
        display: ['none', 'block'],
      },

      active: {
        marginBottom: '5px',
        borderStyle: 'solid',
        borderColor: 'secondary',
        borderWidth: '1px',
      },

      inactive: {
        marginBottom: '5px',
        borderStyle: 'solid',
        borderColor: 'gray',
        borderWidth: '1px',
      },
    },

    featured: {
      flexGrow: 1,
      position: 'relative',

      media: { width: '100%' },

      arrow: carouselArrows,

      paginationDots: shelfPaginationDots,
    },
  },

  carousel: {
    position: 'relative',
    arrow: carouselArrows,
    paginationDots,
    responsivePicture: carouselResponsivePicture,
  },

  shelf: {
    default: {
      arrow: shelfArrows,

      container: {
        width: '100%',
        height: '585px',
        marginTop: '20px',
        marginBottom: '120px',
      },

      title: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '32px',
        fontWeight: 200,
        my: '20px',
      },

      paginationDots: shelfPaginationDots,
    },
  },
}

export default theme
