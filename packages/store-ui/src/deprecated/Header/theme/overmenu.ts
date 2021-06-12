export const overmenuTheme = {
  overmenu: {
    display: ['none', 'none', 'flex'],
    alignItems: 'center',
    justifyContent: 'space-between',
    textDecoration: 'none',
    bg: '#02003d',
    minHeight: '48px',
    color: 'muted',
    fontSize: 1,
    px: [1, 2, 3],

    a: {
      mx: '24px',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      color: 'inherit',
      '&.first': {
        marginLeft: 0,
      },
      '&.last': {
        marginRight: 0,
      },
      '&.active': {
        color: 'textMuted',
      },
      '&:hover': {
        color: 'textMuted',
      },
    },
  },
}
