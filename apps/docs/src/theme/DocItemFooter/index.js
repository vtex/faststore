import React from 'react'
import clsx from 'clsx'
import LastUpdated from '@theme/LastUpdated'
import EditThisPage from '@theme/EditThisPage'
import TagsListInline from '@theme/TagsListInline'
import styles from './styles.module.css'
import { ThemeClassNames } from '@docusaurus/theme-common'

function TagsRow(props) {
  return (
    <div
      className={clsx(
        ThemeClassNames.docs.docFooterTagsRow,
        'w-3/5 text-right text-details'
      )}
    >
      <div>
        <TagsListInline {...props} />
      </div>
    </div>
  )
}

function EditMetaRow({
  editUrl,
  lastUpdatedAt,
  lastUpdatedBy,
  formattedLastUpdatedAt,
}) {
  return (
    <div className={clsx(ThemeClassNames.docs.docFooterEditMetaRow)}>
      <div>{editUrl && <EditThisPage editUrl={editUrl} />}</div>

      <div className={clsx('col', styles.lastUpdated)}>
        {(lastUpdatedAt || lastUpdatedBy) && (
          <LastUpdated
            lastUpdatedAt={lastUpdatedAt}
            formattedLastUpdatedAt={formattedLastUpdatedAt}
            lastUpdatedBy={lastUpdatedBy}
          />
        )}
      </div>
    </div>
  )
}

export default function DocItemFooter(props) {
  const { content: DocContent } = props
  const { metadata } = DocContent
  const {
    editUrl,
    lastUpdatedAt,
    formattedLastUpdatedAt,
    lastUpdatedBy,
    tags,
  } = metadata
  const canDisplayTagsRow = tags.length > 0
  const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy)
  const canDisplayFooter = canDisplayTagsRow || canDisplayEditMetaRow

  if (!canDisplayFooter) {
    return null
  }

  return (
    <footer className="flex w-full justify-between border-t pt-4 text-details text-sm mt-4 mb-10">
      {canDisplayEditMetaRow && (
        <EditMetaRow
          editUrl={editUrl}
          lastUpdatedAt={lastUpdatedAt}
          lastUpdatedBy={lastUpdatedBy}
          formattedLastUpdatedAt={formattedLastUpdatedAt}
        />
      )}
      {canDisplayTagsRow && <TagsRow tags={tags} />}
    </footer>
  )
}
