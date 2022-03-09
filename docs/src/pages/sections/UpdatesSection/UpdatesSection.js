import React from 'react'
import LatestUpdates from '../../../components/LatestUpdates/LatestUpdates.js'
import ViewAll from '../../../components/ViewAll/ViewAll'

const UpdatesSection = () => {
  return (
    <section className="border-b py-20 text-text">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div>
              <h3 className='pt-10 leading-tight text-3xl font-VTEXRegular font-light lg:pt-0'>Stay up-to-date with our latest releases</h3>
              <ViewAll message="View all" linkTo="/releases" />
            </div>
          </div>
          <div className="hidden lg:block lg:w-10/12">
            <LatestUpdates />
          </div>
        </div>
    </section>
  )
}

export default UpdatesSection
