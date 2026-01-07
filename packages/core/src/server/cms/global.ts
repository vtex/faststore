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
  // TODO: remover later
  // Temp Handle case when globalSections or sections array is undefined/empty
  if (
    !globalSections ||
    !globalSections.sections ||
    globalSections.sections.length === 0
  ) {
    console.warn(
      'Global Sections content type was not found or has no sections. Returning minimal structure for development.'
    )
    // Return minimal structure with header and footer sections
    const headerSections = globalSectionsHeader?.sections || []
    const footerSections = globalSectionsFooter?.sections || []

    return {
      sections: [
        ...headerSections,
        {
          name: 'Children',
          data: {},
        },
        ...footerSections,
      ],
      settings: globalSections?.settings || {},
    }
  }

  const childrenIndex = globalSections.sections.findIndex(
    (section) => section.name === 'Children'
  )

  if (childrenIndex === -1) {
    // TODO: remover later - temp warning for testing
    console.warn(
      'Children section in Global Sections not found. Adding it automatically for development.'
    )
    // Add Children section if missing
    const headerSections = globalSectionsHeader?.sections || []
    const footerSections = globalSectionsFooter?.sections || []

    return {
      ...globalSections,
      sections: [
        ...headerSections,
        ...globalSections.sections,
        {
          name: 'Children',
          data: {},
        },
        ...footerSections,
      ],
    }
  }

  const headerSections = globalSectionsHeader?.sections || []
  const footerSections = globalSectionsFooter?.sections || []

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
