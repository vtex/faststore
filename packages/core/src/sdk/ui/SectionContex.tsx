import { createContext, useContext } from 'react'
import { Section } from '@vtex/client-cms'

export const SectionContext = createContext<Section[]>([])

export interface SectionContexProps {
  children?: React.ReactNode
  sections?: Section[]
}

SectionContext.displayName = 'Section Context'

export const useSection = (
  sectionName?: string
): Section | Section[] | undefined => {
  const sections = useContext(SectionContext) ?? []

  if (sectionName) {
    return sections?.find((f) => f.name === sectionName)
  }

  return sections
}

export const SectionProvider: React.FC<SectionContexProps> = ({
  children,
  sections,
}) => {
  return (
    <SectionContext.Provider value={sections}>
      {children}
    </SectionContext.Provider>
  )
}
