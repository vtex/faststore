import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import { translate } from '@docusaurus/Translate'
import styles from './styles.module.css'
export default function BlogSidebarDesktop({ sidebar, tag }) {
  var filteredSidebar = sidebar.items.filter(
    (item) => item.permalink.split('/')[5] === tag
  )
  typeof tag === 'undefined' && (filteredSidebar = sidebar.items)

  if (sidebar.items.length === 0) {
    return null
  }

  const tags = [
    {
      title: 'All ',
      url: '/releases',
    },
    {
      title: 'FastStore ',
      url: '/releases/tags/faststore',
    },
    {
      title: 'WebOps ',
      url: '/releases/tags/webops',
    },
    {
      title: 'Base Store ',
      url: '/releases/tags/basestore',
    },
  ]

  return (
    <aside className="col col--3">
      <nav
        className={clsx(styles.sidebar, 'thin-scrollbar')}
        aria-label={translate({
          id: 'theme.blog.sidebar.navAriaLabel',
          message: 'Blog recent posts navigation',
          description: 'The ARIA label for recent posts in the blog sidebar',
        })}
      >
        <div>
          <h3 className={clsx(styles.sidebarItemTitle, 'mb-2')}>
            Filter by tag
          </h3>
          {
            <span className="flex flex-col center">
              <div>
                {tags.map(({ title, url }) => (
                  <Link
                    key={url}
                    to={url}
                    className={clsx(styles.docTag, 'my-2')}
                  >
                    {title}
                  </Link>
                ))}
              </div>
            </span>
          }
        </div>

        {typeof tag !== 'undefined' && (
          <div>
            <h3 className={clsx(styles.sidebarItemTitle, 'margin-bottom--md')}>
              {tag} releases
            </h3>
            <ul className={styles.sidebarItemList}>
              {filteredSidebar.map((item) => {
                return (
                  <li key={item.permalink} className={styles.sidebarItem}>
                    <Link
                      isNavLink
                      to={item.permalink}
                      className={styles.sidebarItemLink}
                      activeClassName={styles.sidebarItemLinkActive}
                    >
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <div className={clsx(styles.sidebarItemTitle, 'margin-bottom--md')}>
          All Releases
        </div>
        <ul className={clsx(styles.sidebarItemList, 'clean-list')}>
          {sidebar.items.map((item) => (
            <li key={item.permalink} className={styles.sidebarItem}>
              <Link
                isNavLink
                to={'/releases/tags/'.concat(item.permalink.split('/')[5])}
                className={styles.docTag}
              >
                {item.permalink.split('/')[5]}
              </Link>
              <Link
                isNavLink
                to={item.permalink}
                className={styles.sidebarItemLink}
                activeClassName={styles.sidebarItemLinkActive}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
