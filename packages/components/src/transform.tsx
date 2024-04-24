import { API, FileInfo } from 'jscodeshift'

const kebabCase = (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift.withParser('tsx')
  const root = j(file.source)

  console.log('Processing file:', file.path)

  root
    .find(j.JSXElement, {
      openingElement: {
        name: {
          name: 'Icon',
        },
      },
    })
    .forEach((elementPath) => {
      // Replace the name to `fs-kebak-case`
      elementPath.node.openingElement.attributes
        ?.filter(
          (attr) => attr.type === 'JSXAttribute' && attr.name.name === 'name'
        )
        .forEach((attr) => {
          const attrValue = (attr as any)?.value
          if (attrValue && attrValue.type === 'StringLiteral') {
            const iconName = attrValue.value
            const iconDefinition = `fs-${kebabCase(iconName)}`
            attrValue.value = iconDefinition
          }
        })

      // Remove the weight prop
      elementPath.node.openingElement.attributes =
        elementPath.node.openingElement.attributes?.filter(
          (attr) => attr.type !== 'JSXAttribute' || attr.name.name !== 'weight'
        )
    })

  return root.toSource()
}
