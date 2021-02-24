import { createTheme, SxStyleProp, searchFilterTheme } from '../../src'

const accordionDesktop: SxStyleProp = createTheme(searchFilterTheme, {})

const accordionMobile: SxStyleProp = createTheme(accordionDesktop, {
  accordion: {
    collapsible: {
      paddingBottom: 0,
      borderBottom: '1px solid #e2e2e2',

      header: {
        height: '60px',
        backgroundColor: '#fff',
        px: '10px',

        icon: {
          width: '60px',
          height: '60px',
        },
      },

      ul: {
        maxHeight: '',
        overflowY: 'auto',
      },

      li: {
        minHeight: '50px',
        px: '10px',
      },
    },
  },
})

const filtersDesktop: SxStyleProp = {
  title: {
    py: [0, 4],
    fontSize: '20px',
    borderBottom: '1px solid #e3e4e6',
  },

  ...accordionDesktop,
}

const filtersMobile: SxStyleProp = createTheme(filtersDesktop, {
  title: {
    fontSize: 4,
    borderBottom: '1px solid #e2e2e2',
    backgroundColor: '#f0f0f0',
    padding: '10px',
  },

  drawer: {
    container: {
      overflowY: 'scroll',
      backgroundColor: '#fff',
    },
  },

  ...accordionMobile,
})

export const searchTheme: SxStyleProp = {
  searchFilter: {
    desktop: filtersDesktop,
    mobile: filtersMobile,
  },
}
