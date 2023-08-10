import { createContext, useContext, useMemo } from 'react'
import { Section } from '@vtex/client-cms'

export interface AllSections {
  globalSections?: Section[]
  pageSections?: Section[]
}
export const SectionContext = createContext<AllSections>({})

export interface SectionContexProps extends AllSections {
  children?: React.ReactNode
}

SectionContext.displayName = 'Section Context'

/**
 * Return all the sections global and page sections.
 * @param sectionName if pressent it will filter the section if not will return all the sections global and page
 * @returns
 */
export const useSection = (
  sectionName?: string
): Section | Section[] | undefined => {
  const { globalSections, pageSections } = useContext(SectionContext) ?? {
    globalSections: [],
    pageSections: [],
  }

  return useMemo(() => {
    const convinedSections = [...globalSections, ...pageSections]
    if (sectionName) {
      return convinedSections.find((section) => section.name === sectionName)
    }
    return convinedSections
  }, [globalSections, pageSections, sectionName])
}

export const SectionProvider: React.FC<SectionContexProps> = ({
  children,
  globalSections = [],
  pageSections = [],
}) => {
  return (
    <SectionContext.Provider value={{ globalSections, pageSections }}>
      {children}
    </SectionContext.Provider>
  )
}
