import { useEffect } from 'react'
import { Tag as UITag } from '@faststore/ui'
import Section from 'src/components/sections/Section/Section'

import styles from './section.module.scss'

export interface PreviewTagProps {
  text?: string
  exitUrl?: string
}

function PreviewTag({ text = 'Preview', exitUrl }: PreviewTagProps) {
  useEffect(() => {
    const handleBeforeUnload = () => {
      navigator.sendBeacon('/api/preview?action=clear')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const handleExitPreview = () => {
    if (typeof window !== 'undefined') {
      const exitPath =
        exitUrl || window.location.pathname + window.location.search
      window.location.href = `/api/preview?action=clear&redirect=${encodeURIComponent(
        exitPath
      )}`
    }
  }

  return (
    <Section className={`${styles.section} section-preview-tag`}>
      <UITag
        data-fs-preview-tag
        testId="fs-preview-tag"
        variant="danger"
        label={text}
        iconButtonLabel="Exit preview"
        onClose={handleExitPreview}
      />
    </Section>
  )
}

export default PreviewTag
