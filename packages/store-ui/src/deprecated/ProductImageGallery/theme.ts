import type { SxStyleProp } from 'theme-ui'

const paginationDots: SxStyleProp = {
  container: {
    paddingY: '10px',
    paddingX: 0,
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
    position: 'relative',
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

const arrow: SxStyleProp = {
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

const miniature: SxStyleProp = {
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
}

export const productImageGalleryTheme: SxStyleProp = {
  productImageGallery: {
    mx: 2,
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',

    miniature,

    featured: {
      flexGrow: 1,
      position: 'relative',

      media: { width: '100%' },

      arrow,

      paginationDots,
    },
  },
}
