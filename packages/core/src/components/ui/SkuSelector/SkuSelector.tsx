import {
  RadioOption as UIRadioOption,
  SkuSelector as UISkuSelector,
} from '@faststore/ui'
import type { SkuSelectorProps } from '@faststore/ui'

import { Image } from 'src/components/ui/Image'

import styles from './sku-selector.module.scss'

function SkuSelector({ ...props }: SkuSelectorProps) {
  const { options, activeValue, variant } = props

  return (
    <UISkuSelector className={styles.fsSkuSelector} {...props}>
      {options.map((option, index) => {
        return (
          <UIRadioOption
            data-fs-sku-selector-option
            key={String(index)}
            label={option.label}
            value={option.value}
            disabled={option.disabled}
            checked={option.value === activeValue}
          >
            {variant === 'label' && <span>{option.value}</span>}
            {variant === 'image' && 'src' in option && (
              <span>
                <Image
                  src={option.src ?? ''}
                  alt={option.alt}
                  width={20}
                  height={20}
                  loading="lazy"
                  data-fs-sku-selector-option-image
                />
              </span>
            )}
          </UIRadioOption>
        )
      })}
    </UISkuSelector>
  )
}

export default SkuSelector
