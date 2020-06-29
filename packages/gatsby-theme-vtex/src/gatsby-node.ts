import './setup'

import { join } from 'path'

import { ensureDir, outputFile } from 'fs-extra'
import { CreatePagesArgs } from 'gatsby'

const root = process.cwd()

export const createPages = async ({
  actions: { createPage, createRedirect },
  graphql,
}: CreatePagesArgs) => {
  createRedirect({
    fromPath: '/api/*',
    toPath: `https://${process.env.GATSBY_VTEX_TENANT}.${process.env.GATSBY_VTEX_ENVIRONMENT}.com.br/api/:splat`,
    statusCode: 200,
  })

  const { data, errors } = await graphql<any>(`
    query {
      allProduct {
        nodes {
          id
          slug
        }
      }
      allCategory {
        nodes {
          id
          slug
          categoryId
        }
      }
      allCmsPage {
        nodes {
          name
          slug
          src
        }
      }
    }
  `)

  if (errors) {
    console.error(errors)
    return
  }

  const { allProduct, allCmsPage, allCategory } = data

  // Product Pages

  // Pre generated product pages
  allProduct.nodes.forEach((product: any) => {
    createPage({
      path: product.slug,
      component: join(root, `./src/templates/product/server.tsx`),
      context: {
        id: product.id,
      },
    })
  })

  // Client-side rendered product pages
  createPage({
    path: '/:slug/p',
    matchPath: '/:slug/p',
    component: join(root, `./src/templates/product/client.tsx`),
    context: {},
  })

  // Category Pages

  allCategory.nodes.forEach((category: any) => {
    createPage({
      path: category.slug,
      component: join(root, `./src/templates/category.tsx`),
      context: {
        id: category.id,
      },
    })
  })

  // CMS Pages

  // ensure dist folder
  const cmsRoot = join(root, '.cache/vtex-cms')

  await ensureDir(cmsRoot)

  // Create page .tsx files as well as gatsby's node pages
  const cmsPages = allCmsPage.nodes.map(async (page: any) => {
    const { src, slug, name } = page
    const filepath = join(cmsRoot, `${name}.tsx`)

    await outputFile(filepath, src)

    createPage({
      path: slug,
      component: filepath,
      context: {},
    })
  })

  await Promise.all(cmsPages)
}
