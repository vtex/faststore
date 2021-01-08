import React from 'react'
import type { FC } from 'react'
import type { PageProps } from 'gatsby'

import SiteMetadata from '../SEO/SiteMetadata'

type Props = PageProps<unknown>

const SEO: FC<Props> = () => <SiteMetadata />

export default SEO
