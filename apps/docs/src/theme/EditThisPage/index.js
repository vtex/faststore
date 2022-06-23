import React from 'react'
import Translate from '@docusaurus/Translate'
export default function EditThisPage({ editUrl }) {
  return (
    <a
      href={editUrl}
      target="_blank"
      rel="noreferrer noopener"
      className="text-details hover:no-underline"
    >
      <Translate
        id="theme.common.editThisPage"
        description="The link label to edit the current page"
      >
        Edit this page on Github
      </Translate>
    </a>
  )
}
