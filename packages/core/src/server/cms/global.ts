import type { GlobalSectionsData } from 'src/components/cms/GlobalSections'

type InjectGlobalSectionsProps = {
  globalSections: GlobalSectionsData
  globalSectionsHeader: GlobalSectionsData
  globalSectionsFooter: GlobalSectionsData
}

export function injectGlobalSections({
  globalSections,
  globalSectionsHeader,
  globalSectionsFooter,
}: InjectGlobalSectionsProps) {
  const childrenIndex = globalSections.sections.findIndex(
    (section) => section.name === 'Children'
  )

  const headerSections = globalSectionsHeader?.sections || []
  const footerSections = globalSectionsFooter?.sections || []

  if (childrenIndex === -1) {
    console.warn(
      'Children section in Global Sections content-type was not found. Returning sections without children injection.'
    )

    return {
      ...globalSections,
      sections: [
        ...globalSections.sections,
        ...headerSections,
        ...footerSections,
      ],
    }
  }

  return {
    ...globalSections,
    sections: [
      ...globalSections.sections.slice(0, childrenIndex),
      ...headerSections,
      globalSections.sections[childrenIndex],
      ...footerSections,
      ...globalSections.sections.slice(childrenIndex + 1),
    ],
  }
}
