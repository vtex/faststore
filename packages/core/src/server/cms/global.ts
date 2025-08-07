import type { GlobalSectionsData } from '../../components/cms/GlobalSections'
import ChildrenSectionNotFoundError from 'src/sdk/error/ChildrenSectionNotFoundError'

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
