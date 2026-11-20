import type { Section } from '@vtex/client-cms'
import type { ReactNode } from 'react'

export type PageSectionsRendererProps = {
  contentType: string
  sections: Section[]
  settings?: Record<string, unknown>
  renderSections: (sections: Section[]) => ReactNode
}

export default function PageSectionsRenderer({
  sections,
  renderSections,
}: PageSectionsRendererProps) {
  return <>{renderSections(sections)}</>
}
