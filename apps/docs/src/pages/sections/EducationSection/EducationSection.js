import React from 'react'
import DocUpdate from '../../../components/DocUpdate/DocUpdate'
import LatestUpdates from '../../../components/LatestUpdates/LatestUpdates.js'

const EducationSection = () => {
  return (
    <section className="grid md:grid-cols-2 sm:grid-cols-1 gap-20 my-16">
      <LatestUpdates />
      <DocUpdate />
    </section>
  )
}

export default EducationSection