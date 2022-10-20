import React from 'react'
import clsx from 'clsx'
import DocPaginator from '@theme/DocPaginator'
import DocVersionBanner from '@theme/DocVersionBanner'
import DocVersionBadge from '@theme/DocVersionBadge'
import DocItemFooter from '@theme/DocItemFooter'
import TOC from '@theme/TOC'
import TOCCollapsible from '@theme/TOCCollapsible'
import Heading from '@theme/Heading'
import styles from './styles.module.css'
import DocFooter from '../../components/DocFooter/DocFooter'
import FeedbackScan from '@site/src/components/FeedbackScan/FeedbackScan'
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
  useWindowSize,
} from '@docusaurus/theme-common'
import DocBreadcrumbs from '@theme/DocBreadcrumbs'
import MDXContent from '@theme/MDXContent'

function DocItemMetadata(props) {
  const { content: DocContent } = props
  const { metadata, frontMatter, assets } = DocContent
  const { keywords } = frontMatter
  const { description, title } = metadata
  const image = assets.image ?? frontMatter.image
  return (
    <PageMetadata
      {...{
        title,
        description,
        keywords,
        image,
      }}
    />
  )
}

function DocItemContent(props) {
  const { content: DocContent } = props
  const { metadata, frontMatter } = DocContent
  const {
    hide_title: hideTitle,
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter
  const { title } = metadata // We only add a title if:
  // - user doesn't ask to hide it with front matter
  // - the markdown content does not already contain a top-level h1 heading

  const shouldAddTitle =
    !hideTitle && typeof DocContent.contentTitle === 'undefined'
  const windowSize = useWindowSize()
  const canRenderTOC =
    !hideTableOfContents && DocContent.toc && DocContent.toc.length > 0
  const renderTocDesktop =
    canRenderTOC && (windowSize === 'desktop' || windowSize === 'ssr')
  return (
    <div className="row">
      <div className={clsx('col', !hideTableOfContents && styles.docItemCol)}>
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <div className='flex flex-row justify-between'>
            <DocBreadcrumbs />
            <FeedbackScan/>
            </div>
            <DocVersionBadge />

            {canRenderTOC && (
              <TOCCollapsible
                toc={DocContent.toc}
                minHeadingLevel={tocMinHeadingLevel}
                maxHeadingLevel={tocMaxHeadingLevel}
                className={clsx(
                  ThemeClassNames.docs.docTocMobile,
                  styles.tocMobile
                )}
              />
            )}

            <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
              {/*
               Title can be declared inside md content or declared through
               front matter and added manually. To make both cases consistent,
               the added title is added under the same div.markdown block
               See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120
               */}
              {shouldAddTitle && (
                <header>
                  <Heading as="h1">{title}</Heading>
                </header>
              )}
              <MDXContent>
                <DocContent />
              </MDXContent>
            </div>
          </article>

          <DocPaginator previous={metadata.previous} next={metadata.next} />
          <DocItemFooter {...props} />
          <DocFooter />
        </div>
      </div>
      {renderTocDesktop && (
        <div className="col col--3">
          <TOC
            toc={DocContent.toc}
            minHeadingLevel={tocMinHeadingLevel}
            maxHeadingLevel={tocMaxHeadingLevel}
            className={ThemeClassNames.docs.docTocDesktop}
          />
        </div>
      )}
    </div>
  )
}

export default function DocItem(props) {
  const docHtmlClassName = `docs-doc-id-${props.content.metadata.unversionedId}`
  return (
    <HtmlClassNameProvider className={docHtmlClassName}>
      <DocItemMetadata {...props} />
      <DocItemContent {...props} />
    </HtmlClassNameProvider>
  )
}
