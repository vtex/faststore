import styles from './typeset.module.css'

type scaleItem = {
  size: number
  token: string
}

type scaleVariants = 'mobile' | 'desktop'

export type TypesetProps = {
  sample?: string
  scale?: scaleVariants
  scaleItems: scaleItem[]
}

const Typeset = ({ sample, scaleItems, scale = 'mobile' }: TypesetProps) => {
  const sampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  const variation =
    scale == 'mobile'
      ? 'var(--fs-text-scale-mobile)'
      : 'var(--fs-text-scale-desktop)'

  return (
    <ul className={styles.typeset} data-doc-typeset-variation={scale}>
      {scaleItems.map((item, index) => (
        <li key={`fs-typeset-${index}-${item.size}`}>
          <span>{item.size}</span>
          <p
            style={{
              fontSize: `${item.size}px`,
            }}
          >
            {sample ? sample : sampleText}
          </p>
        </li>
      ))}
    </ul>
  )
}

export default Typeset
