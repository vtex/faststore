import { Content, Block, isBlock } from './cms'

interface RenderMetaInfo {
  imports: Map<string, string> // components used during rendering
}

const parseBlockName = (name: string) => {
  const splitted = name.split('/')

  if (splitted.length === 1) {
    return {
      component: splitted[0],
    }
  }

  const dependency = splitted.slice(0, splitted.length - 1).join('/')
  const component = splitted[splitted.length - 1]

  return {
    dependency,
    component,
  }
}

export class ContentDOM {
  protected meta: RenderMetaInfo

  constructor(protected content: Content) {
    this.meta = {
      imports: new Map(),
    }
  }

  public renderToString = (): string => {
    let afterBlocksStr
    let beforeBlocksStr
    const { blocks, beforeBlocks, afterBlocks } = this.content

    const blocksStr = this.renderBlocksToString(blocks)

    if (beforeBlocks) {
      beforeBlocksStr = this.renderBlocksToString(beforeBlocks)
    }

    if (afterBlocks) {
      afterBlocksStr = this.renderBlocksToString(afterBlocks)
    }

    const imports = this.renderImportsToString()

    return `
import React, { FC } from 'react'

${imports}

const CMSAutogenPage: FC = () => (
  <>
    ${beforeBlocksStr}
    ${blocksStr}
    ${afterBlocksStr}
  </>
)

export default CMSAutogenPage
`
  }

  protected renderImportsToString = () => {
    let imports = ''

    for (const [component, dep] of this.meta.imports.entries()) {
      const statement = `import ${component} from '${dep}'`

      imports = `${imports}\n${statement}`
    }

    return imports
  }

  protected renderBlocksToString = (blocks: Block[]) => {
    if (!blocks) return

    const inner = blocks.map((b) => this.renderBlockToString(b)).join('\n')

    return `${inner}`
  }

  protected renderBlockToString = (block: Block): string => {
    const { name, props } = block
    const { component, dependency } = parseBlockName(name)
    const propsStr = this.propsToString(props)

    // Extract meta info from block

    // Sometimes the component is just a <div> or some other
    // builtin component. Let's not import a div in import
    // statements
    if (dependency) {
      // Add block into page imports
      this.meta.imports.set(component, name)
    }

    let inner
    const { children } = props

    if (isBlock(children)) {
      inner = this.renderBlockToString(children)
    } else if (Array.isArray(children) && children.every(isBlock)) {
      inner = this.renderBlocksToString(children)
    }

    return `<${component} ${propsStr}>${inner ?? ''}</${component}>`
  }

  protected propsToString = (props: any = {}): string =>
    Object.keys(props).reduce((acc, propName) => {
      if (propName === 'children') {
        return acc
      }

      const prop = props[propName]
      let propStr = ''

      if (typeof prop === 'string') {
        propStr = `"${prop}"`
      } else if (typeof prop === 'number' || typeof prop === 'boolean') {
        propStr = `${prop}`
      } else if (typeof prop === 'object') {
        propStr = `{${JSON.stringify(prop)}}`
      } else {
        throw new Error(
          `Unknown type ${typeof prop} while generating code for prop ${propName}`
        )
      }

      return `${acc} ${propName}=${propStr}`
    }, '')
}
