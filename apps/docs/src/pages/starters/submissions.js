import React from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import StarterSubmissionForm from '../sections/StarterSubmissionForm/StarterSubmissionForm'
import styles from './Submissions.module.css'

function Submissions() {
  return (
    <Layout title="Starter Community Submissions">
      <div className={styles.header}>
        <div className="pt-10 sm:w-1/3 px-5">
          <div className="tracking-wider uppercase text-sm text-fontSecondary">
            <Link href="/starters">← Back</Link>
          </div>
          <p className="pt-20 uppercase text-sm text-seriousBlack font-bold">
            Starter Community
          </p>
          <h1 className="text-5xl text-seriousBlack font-VTEXTrust py-5">
            Submit your starter
          </h1>
          <p className="text-lg pt-3 text-[#4A596B]">
            Submit your starter and get featured on the FastStore Community
            Starters Library! If your starter meets our basic standards,{' '}
            {"we'll"} add it as quickly as possible to the Library.
          </p>
        </div>
        <img
          src="https://vtexhelp.vtexassets.com/assets/docs/src/starter-submissions___d566d94c0e7e97fe4393a8eee8f3eec0.png"
          className="block sm:w-1/3 sm:object-contain pt-12 sm:ml-10"
        />
      </div>

      <div className="bg-[#F8F7FC] px-5 py-16">
        <div className="sm:w-2/3 mx-auto">
          <h2 className="text-3xl mb-4 text-seriousBlack font-VTEXTrust">
            Submissions
          </h2>
          <StarterSubmissionForm />
        </div>
      </div>
    </Layout>
  )
}

export default Submissions
