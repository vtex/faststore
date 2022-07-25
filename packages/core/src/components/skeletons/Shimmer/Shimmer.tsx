import styles from './shimmer.module.scss'

function Shimmer() {
  return (
    <div className={styles.fsShimmer} data-fs-shimmer-wrapper>
      <div data-fs-shimmer />
    </div>
  )
}

export default Shimmer
