import { parse } from 'react-docgen-typescript'

export const faststoreComponentsFromNodeModules = `node_modules/@faststore/components`

export function mapComponentFromMdxPath(
  absoluteMdxPath: string,
  fileName: string
) {
  const faststoreMonorepoDir = absoluteMdxPath.split('/apps/site/')[0]
  const faststoreComponentsSrcFromNodeModules = `${faststoreMonorepoDir}/node_modules/@faststore/components/src`

  const dirs = absoluteMdxPath.split('/')

  // 2 levels before e.g. molecules/accordion.mdx
  while (dirs.length > 2) {
    dirs.shift()
  }

  const atomicDesignType = dirs[0] // atoms, molecules, organisms
  const componentNameWithoutExtension = dirs[1].split('.')[0] // e.g. accordion.mdx -> accordion
  const componentFolder =
    componentNameWithoutExtension.charAt(0).toUpperCase() +
    componentNameWithoutExtension.slice(1) // e.g. Accordion

  // e.g. <user-path>/faststore/node_modules/@faststore/components/src/molecules/Accordion/Accordion.tsx
  return [
    faststoreComponentsSrcFromNodeModules,
    atomicDesignType,
    componentFolder,
    fileName,
  ].join('/')
}

export function getComponentPropsFrom(
  absoluteMdxPath: string,
  fileName: string
) {
  const componentPath = mapComponentFromMdxPath(absoluteMdxPath, fileName)
  const options = {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldExtractValuesFromUnion: true,
    propFilter: (prop) =>
      prop?.parent?.fileName?.includes(faststoreComponentsFromNodeModules),
  }

  const componentInfo = parse(componentPath, options)
  const componentProps = componentInfo?.[0]?.props ?? {}

  return Object.keys(componentProps).map((key) => {
    const prop = componentProps[key]
    return {
      name: key,
      type: prop.type?.name ?? '',
      required: prop.required,
      default: prop.defaultValue?.value ?? '',
      description: prop.description ?? '',
    }
  })
}
