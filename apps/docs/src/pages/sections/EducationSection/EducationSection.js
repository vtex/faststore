import React from 'react'
import DocUpdate from '../../../components/DocUpdate/DocUpdate'
import DocStructure from '../../../components/DocStructure/DocStructure'

const EducationSection = () => {
  return (
    <section className="py-20 text-text grid md:grid-cols-2 gap-10 sm:grid-cols-1">
      <DocUpdate/>
      <DocStructure/>
    </section>
  )
}

export default EducationSection
