import React from 'react'
import Link from '@docusaurus/Link'
import BlogLayout from '@theme/BlogLayout'
import BlogPostItem from '@theme/BlogPostItem'
import Translate, { translate } from '@docusaurus/Translate'
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
  usePluralForm,
} from '@docusaurus/theme-common'
import BlogListPaginator from '@theme/BlogListPaginator'
import SearchMetadata from '@theme/SearchMetadata'
import clsx from 'clsx' // Very simple pluralization: probably good enough for now

function useBlogPostsPlural() {
  const { selectMessage } = usePluralForm()
  return (count) =>
    selectMessage(
      count,
      translate(
        {
          id: 'theme.blog.post.plurals',
          description:
            'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: 'One release|{count} releases',
        },
        {
          count,
        }
      )
    )
}

export default function BlogTagsPostsPage({
  tag,
  items,
  sidebar,
  listMetadata,
}) {
  const blogPostsPlural = useBlogPostsPlural()
  const title = translate(
    {
      id: 'theme.blog.tagTitle',
      description: 'The title of the page for a blog tag',
      message: '{nPosts} tagged with "{tagName}"',
    },
    {
      nPosts: blogPostsPlural(tag.count),
      tagName: tag.label,
    }
  )
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogTagPostListPage
      )}
    >
      <PageMetadata title={title} />
      <SearchMetadata tag="blog_tags_posts" />
      <BlogLayout sidebar={sidebar} tag={tag.label}>
        <header className="margin-bottom--xl">
          <h1>{title}</h1>

          <Link href={tag.allTagsPath}>
            <Translate
              id="theme.tags.tagsPageLink"
              description="The label of the link targeting the tag list page"
            >
              View All Tags
            </Translate>
          </Link>
        </header>

        {items.map(({ content: BlogPostContent }) => (
          <BlogPostItem
            key={BlogPostContent.metadata.permalink}
            frontMatter={BlogPostContent.frontMatter}
            assets={BlogPostContent.assets}
            metadata={BlogPostContent.metadata}
            truncated
          >
            <BlogPostContent />
          </BlogPostItem>
        ))}
        <BlogListPaginator metadata={listMetadata} />
      </BlogLayout>
    </HtmlClassNameProvider>
  )
}
