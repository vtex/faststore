const base = `/api/vtexid`

export const api = {
  pub: {
    authentication: {
      startlogin: `${base}/pub/authentication/startlogin`,
      accesskey: {
        send: `${base}/pub/authentication/accesskey/send`,
        validate: `${base}/pub/authentication/accesskey/validate`,
      },
      oauth: {
        redirect: `${base}/pub/authentication/oauth/redirect`,
      },
      classic: {
        validate: `${base}/pub/authentication/classic/validate`,
        setpassword: `${base}/pub/authentication/classic/setpassword`,
      },
    },
  },
  oauth: {
    error: `${base}/oauth/error`,
    finish: `${base}/oauth/finish`,
  },
}
