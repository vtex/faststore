import React from 'react'
import BlogLayout from '@theme/BlogLayout'
import BlogPostItem from '@theme/BlogPostItem'
import BlogPostPaginator from '@theme/BlogPostPaginator'
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common'
import TOC from '@theme/TOC'
import clsx from 'clsx'

function BlogPostPageMetadata(props) {
  const { content: BlogPostContents } = props
  const { assets, metadata } = BlogPostContents
  const { title, description, date, tags, authors, frontMatter } = metadata
  const { keywords } = frontMatter
  const image = assets.image ?? frontMatter.image
  return (
    <PageMetadata
      title={title}
      description={description}
      keywords={keywords}
      image={image}
    >
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content={date} />
      {/* TODO double check those article meta array syntaxes, see https://ogp.me/#array */}
      {authors.some((author) => author.url) && (
        <meta
          property="article:author"
          content={authors
            .map((author) => author.url)
            .filter(Boolean)
            .join(',')}
        />
      )}
      {tags.length > 0 && (
        <meta
          property="article:tag"
          content={tags.map((tag) => tag.label).join(',')}
        />
      )}
    </PageMetadata>
  )
}

function BlogPostPageContent(props) {
  const { content: BlogPostContents, sidebar } = props
  const { assets, metadata } = BlogPostContents
  const { permalink, nextItem, prevItem, frontMatter } = metadata
  const {
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter
  const tag = permalink.split('/')[5]
  return (
    <BlogLayout
      tag={tag}
      sidebar={sidebar}
      toc={
        !hideTableOfContents &&
        BlogPostContents.toc &&
        BlogPostContents.toc.length > 0 ? (
          <TOC
            toc={BlogPostContents.toc}
            minHeadingLevel={tocMinHeadingLevel}
            maxHeadingLevel={tocMaxHeadingLevel}
          />
        ) : undefined
      }
    >
      <BlogPostItem
        frontMatter={frontMatter}
        assets={assets}
        metadata={metadata}
        isBlogPostPage
      >
        <BlogPostContents />
      </BlogPostItem>

      {(nextItem || prevItem) && (
        <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
      )}
    </BlogLayout>
  )
}

export default function BlogPostPage(props) {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogPostPage
      )}
    >
      <BlogPostPageMetadata {...props} />
      <BlogPostPageContent {...props} />
    </HtmlClassNameProvider>
  )
}
