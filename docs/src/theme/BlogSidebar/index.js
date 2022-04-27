/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import styles from './styles.module.css'
import { translate } from '@docusaurus/Translate'
export default function BlogSidebar({ sidebar }) {
  var filteredSidebar = sidebar.items.filter(
    (item) => item.permalink.split('/')[5] === sidebar.tag
  )
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
      url: '/releases/tags/base-store',
    },
  ]

  return (
    <nav
      className={clsx(styles.sidebar, 'thin-scrollbar')}
      aria-label={translate({
        id: 'theme.blog.sidebar.navAriaLabel',
        message: 'Blog recent posts navigation',
        description: 'The ARIA label for recent posts in the blog sidebar',
      })}
    >
      <div>
        <h3 className={styles.sidebarItemTitle}>Filter by tag</h3>
        {
          <span>
            {tags.map(({ title, url }) => (
              <Link key={url} to={url} className={styles.tagLink}>
                {title}
              </Link>
            ))}
          </span>
        }
      </div>

      {sidebar.tag !== undefined && (
        <div>
          <h3 className={styles.sidebarItemTitle}>{sidebar.tag} releases</h3>
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
        {sidebar.title}
      </div>
      <ul className={styles.sidebarItemList}>
        {sidebar.items.map((item) => (
          <li key={item.permalink} className={styles.sidebarItem}>
            <Link
              isNavLink
              to={item.permalink}
              className={styles.sidebarItemLink}
              activeClassName={styles.sidebarItemLinkActive}
            >
              <div className={styles.docTag}>
                {item.permalink.split('/')[5]}
              </div>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
