import type { GlobalSectionsData } from 'src/components/cms/GlobalSections'
import ChildrenSectionNotFoundError from 'src/sdk/error/ChildrenSectionNotFoundError'

type InjectGlobalSectionsProps = {
  globalSections: GlobalSectionsData
  globalSectionsHeader: GlobalSectionsData
  globalSectionsFooter: GlobalSectionsData
}

function createMinimalGlobalSections({
  globalSectionsHeader,
  globalSectionsFooter,
  settings,
}: {
  globalSectionsHeader: GlobalSectionsData
  globalSectionsFooter: GlobalSectionsData
  settings?: any
}): GlobalSectionsData {
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
    settings: settings || {},
  }
}

export function injectGlobalSections({
  globalSections,
  globalSectionsHeader,
  globalSectionsFooter,
}: InjectGlobalSectionsProps) {
  if (
    !globalSections ||
    !globalSections.sections ||
    globalSections.sections.length === 0
  ) {
    console.warn(
      'Global Sections content type was not found or has no sections. Returning minimal structure for development.'
    )
    return createMinimalGlobalSections({
      globalSectionsHeader,
      globalSectionsFooter,
      settings: globalSections?.settings,
    })
  }

  const childrenIndex = globalSections.sections.findIndex(
    (section) => section.name === 'Children'
  )

  if (childrenIndex === -1) {
    throw new ChildrenSectionNotFoundError(
      'Children section in Global Sections content type was not found. Please add a Children Section.'
    )
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
