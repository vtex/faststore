import './setup'

import { CreateNodeArgs, GatsbyNode } from 'gatsby'

import { Content } from './cms'
import { BlockDOM } from './compiler'

const TYPE = 'CMSPage'

const isContent = (c: any): c is Content =>
  typeof c.meta?.slug === 'string' &&
  Array.isArray(c.blocks) &&
  (c.blocks.length === 0 || (c.blocks[0].name && c.blocks[0].props))

export const onCreateNode: GatsbyNode['onCreateNode'] = async ({
  node,
  actions: { createNode, createParentChildLink },
  createNodeId,
  loadNodeContent,
  createContentDigest,
}: CreateNodeArgs) => {
  // We should only check JSON nodes
  if (node.internal.mediaType !== 'application/json') {
    return
  }

  // We should only check for CMS typed JSON nodes
  const contentStr = await loadNodeContent(node)
  const content = JSON.parse(contentStr)
  if (!isContent(content)) {
    return
  }

  const dom = new BlockDOM(content.blocks)

  const obj = {
    src: dom.renderToString(),
    slug: content.meta.slug,
    name: node.name,
  }

  const compiled = {
    ...obj,
    id: createNodeId(`${TYPE}-${node.id}`),
    children: [],
    parent: node.id,
    internal: {
      contentDigest: createContentDigest(obj),
      type: TYPE,
      mediaType: 'text/plain',
    },
  }
  createNode(compiled)
  createParentChildLink({ parent: node, child: compiled as any })
}
