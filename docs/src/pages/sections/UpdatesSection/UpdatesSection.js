import React from 'react'
import LatestUpdates from '../../../components/LatestUpdates/LatestUpdates.js'
import styles from './UpdatesSection.module.css'
import ViewAll from '../../../components/ViewAll/ViewAll'

const UpdatesSection = () => {
  return (
    <section className={styles.updatesSection}>
      <div className="container">
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <div>
              <h3>Stay up-to-date with our latest releases</h3>
              <ViewAll message="View all" linkTo="/releases" />
            </div>
          </div>
          <div className={styles.releases}>
            <LatestUpdates />
          </div>
        </div>
      </div>
    </section>
  )
}

export default UpdatesSection
