import React from 'react'
import { Link as MuiLink, LinkProps } from '@material-ui/core'

// TODO: PR to https://github.com/hupe1980/gatsby-theme-material-ui
import { GatsbyLink } from './gLink'

// eslint-disable-next-line
const Link = React.forwardRef<
  HTMLAnchorElement,
  LinkProps & { to?: string; activeClassName?: string }
>((props, ref) => {
  const { to } = props

  return to ? (
    <MuiLink ref={ref} component={GatsbyLink} to={to} {...props} />
  ) : (
    <MuiLink ref={ref} {...props} />
  )
})

export default Link
