import { SxStyleProp } from 'theme-ui'

export const searchControlsTheme: SxStyleProp = {
  searchControls: {
    display: 'flex',
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: ['space-around', 'space-between'],
    alignItems: 'center',
    my: ['10px', 4],

    totalCount: {
      mt: ['10px', 0],
      pt: ['10px', 0],
      width: ['100%', 'auto'],
      textAlign: 'center',
      borderTop: ['1px solid #e2e2e2', 'none'],
      span: {
        fontWeight: 'bold',
      },
    },

    select: {
      px: '8px',
      py: ['6px', '2px'],
      color: 'grey',
      minWidth: '170px',
      textTransform: 'capitalize',
      borderColor: 'transparent',
    },

    filtersButton: {
      display: ['block', 'none'],
      backgroundColor: 'white',
      color: 'grey',
    },
  },
}
