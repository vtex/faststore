import React from 'react'

import styles from './PropsComponent.module.css'

const PropsComponent = ({
  name,
  type,
  description,
  defaultValue,
  possibleValues,
  required,
}) => (
  <div className={styles.propsComponent}>
    <div className={styles.propsHeader}>
      <code className={styles.propsName}>{name}</code>
      {required ? <span className={styles.propsRequired}>*</span> : false}
      <code className={styles.propsType}>{type}</code>
    </div>
    <div>
      {description && <div className={styles.propsDetails}>
        <div className={styles.propsDetailsTitle}>Description</div>
        <div className={styles.propsDetailsDescription}>
          <p>{description}</p>
        </div>
      </div>}
      {defaultValue &&
      <div className={styles.propsDetails}>
        <div className={styles.propsDetailsTitle}>Default value</div>
        <div className={styles.propsDetailsDescription}>
          <code>{defaultValue}</code>
        </div>
      </div>}
      {possibleValues &&
      <div className={styles.propsDetails}>
        <div className={styles.propsDetailsTitle}>Possible values</div>
        <div className={styles.propsDetailsDescription}>
          <code>{possibleValues}</code>
        </div>
      </div>}
    </div>
  </div>
)

export default PropsComponent
