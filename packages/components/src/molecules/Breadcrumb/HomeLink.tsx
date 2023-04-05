import React from 'react'
import { Icon, Link } from '../..'

const HomeLink = () => (
  <Link
    data-fs-breadcrumb-link
    data-fs-breadcrumb-link-home
    aria-label="Go to homepage"
    href="/"
  >
    <Icon name="House" width={18} height={18} />
  </Link>
)

export default HomeLink
