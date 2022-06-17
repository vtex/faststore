import React from 'react'
import BlogSidebarDesktop from '@theme/BlogSidebar/Desktop'
import BlogSidebarMobile from '@theme/BlogSidebar/Mobile'
import { useWindowSize } from '@docusaurus/theme-common'
export default function BlogSidebar({ sidebar, tag }) {
  const windowSize = useWindowSize()

  if (!sidebar?.items.length) {
    return null
  } // Mobile sidebar doesn't need to be server-rendered

  if (windowSize === 'mobile') {
    return <BlogSidebarMobile sidebar={sidebar} />
  }

  return <BlogSidebarDesktop sidebar={sidebar} tag={tag} />
}
