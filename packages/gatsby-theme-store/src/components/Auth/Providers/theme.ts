import type { SxStyleProp } from '@vtex/store-ui'

const baseButton: SxStyleProp = {
  width: '100%',
  minHeight: '40px',
  my: '4px',
  textTransform: 'uppercase',
  backgroundColor: '#eef3f7',
  color: 'primary',
  borderColor: '#e9e9e9',
  borderWidth: '1px',
  borderStyle: 'solid',
  fontSize: '16px',
  fontWeight: 500,
  cursor: 'pointer',
}

const login: SxStyleProp = {
  page: {
    container: {
      flexWrap: 'wrap-reverse',
      width: '100%',
      minHeight: '500px',
      justifyContent: 'center',
      alignItems: 'flex-end',
      py: '12px',
    },

    group: {
      width: '340px',
      mx: '30px',
      borderTopWidth: '1px',
      borderTopColor: '#f3f3f3',
      borderTopStyle: 'solid',

      title: {
        textAlign: 'center',
        my: '8px',
      },
    },

    emailVerification: baseButton,

    emailAndPassword: baseButton,

    google: {
      ...baseButton,
      backgroundColor: 'white',
    },

    facebook: {
      ...baseButton,
      backgroundColor: 'white',
    },
  },
}

const baseInput: SxStyleProp = {
  width: '100%',
  height: '41px',
  borderColor: '#e3e4e6',
  borderWidth: '1px',
  borderStyle: 'solid',
  color: '#3f3f40',
  fontSize: '16px',
  fontWeight: 400,
  px: '16px',
  py: '1px',
  my: '8px',
}

const emailAndPassword: SxStyleProp = {
  page: {
    my: '10px',

    title: {
      textAlign: 'center',
      my: '8px',
    },

    subtitle: {
      color: '#727273',
      my: '8px',
    },

    input: baseInput,

    button: {
      width: '100%',
      textTransform: 'capitalize',
      marginTop: '16px',
      cursor: 'pointer',
    },

    forgotPassword: {
      fontSize: '14px',
      color: 'primary',
      textAlign: 'right',
      cursor: 'pointer',
    },

    signup: {
      fontSize: '14px',
      color: 'primary',
      textAlign: 'center',
      margin: '12px',
      cursor: 'pointer',
    },
  },
}

const googleOAuth: SxStyleProp = {
  page: {
    title: {
      my: '8px',
      textAlign: 'center',
    },

    button: {
      my: 2,
      width: '100%',
    },
  },
}

export default {
  login,
  emailAndPassword,
  emailVerification: emailAndPassword,
  googleOAuth,
  facebookOAuth: googleOAuth,
}
