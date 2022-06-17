import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import BlogSidebar from '@theme/BlogSidebar'
export default function BlogLayout(props) {
  const { tag, permalink, sidebar, toc, children, ...layoutProps } = props
  const hasSidebar = sidebar && sidebar.items.length > 0
  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          <BlogSidebar sidebar={sidebar} tag={tag} />
          <main
            className={clsx('col', {
              'col--7': hasSidebar,
              'col--9 col--offset-1': !hasSidebar,
            })}
            itemScope
            itemType="http://schema.org/Blog"
          >
            {children}
          </main>
          {toc && <div className="col col--2">{toc}</div>}
        </div>
      </div>
    </Layout>
  )
}
