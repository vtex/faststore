import { API, FileInfo } from 'jscodeshift'

const kebabCase = (str: string) => {
  return str
    .replace(/^([A-Z])/, (match: string) => match.toLowerCase()).replace(/([A-Z])/g, '-$1').toLowerCase(); 
};
// XYCircle => x-y-circle

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
      // Step 1: Replace the name prop using kebab-case
      elementPath.node.openingElement.attributes =
        elementPath.node.openingElement.attributes
          ?.map((attr) => {
            if (
              attr.type === 'JSXAttribute' &&
              attr.name.name === 'name' &&
              attr.value &&
              attr.value.type === 'StringLiteral'
            ) {
              const iconName = attr.value.value
              if (!iconName.startsWith('fs-')) {
              const iconDefinition = `fs-${kebabCase(iconName)}`
              return j.jsxAttribute(
                j.jsxIdentifier('name'),
                j.literal(iconDefinition)
              )}
            }
            return attr
          })
          .filter(
            // Step 2: Remove the weight prop
            (attr) =>
              attr.type !== 'JSXAttribute' || attr.name.name !== 'weight'
          )

          // Step 3: Convert width and height to size prop
          const widthAttr = elementPath.node.openingElement.attributes?.find(
            (attr: any) => attr.name.name === 'width'
          ) as any
          const heightAttr = elementPath.node.openingElement.attributes?.find(
            (attr: any) => attr.name.name === 'height'
          ) as any

          if (widthAttr || heightAttr) {
            const sizeValue = widthAttr
              ? widthAttr.value?.expression?.value
              : heightAttr?.value?.expression?.value
    
            if (sizeValue) {
              const newSizeValue = [20, 24, 32].includes(sizeValue) ? sizeValue : 20
    
              // Create size prop
              const sizeProp = j.jsxAttribute(
                j.jsxIdentifier('size'),
                // To pass as expression size={20}
                j.jsxExpressionContainer(j.literal(newSizeValue))
              )
    
              // Replace width/height with size prop
              elementPath.node.openingElement.attributes = [
                ...(elementPath.node.openingElement.attributes || []).filter(
                  (attr: any) =>
                    attr.name.name !== 'width' && attr.name.name !== 'height'
                ),
                sizeProp,
              ]
            }
          }
          
    })
  return root.toSource()
}