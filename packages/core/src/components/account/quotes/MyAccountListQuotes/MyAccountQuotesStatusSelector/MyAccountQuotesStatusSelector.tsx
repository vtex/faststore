import { useEffect, useId, useRef, useState } from 'react'

import { quoteStatusMap } from 'src/utils/quoteStatus'
import styles from './styles.module.scss'

type MyAccountQuotesStatusSelectorProps = Readonly<{
  value: string[]
  onChange: (selected: string[]) => void
}>

const statusEntries = Object.entries(quoteStatusMap).map(([key, entry]) => ({
  key,
  label: entry.label,
  variant: entry.variant,
}))

export default function MyAccountQuotesStatusSelector({
  value,
  onChange,
}: MyAccountQuotesStatusSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const labelId = useId()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggle = (key: string) => {
    const next = value.includes(key)
      ? value.filter((v) => v !== key)
      : [...value, key]
    onChange(next)
  }

  const remove = (key: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== key))
  }

  return (
    <div className={styles.wrapper} ref={ref} data-fs-quotes-status-selector>
      <span id={labelId} className={styles.label}>
        Status
      </span>
      <div data-fs-quotes-status-input-wrapper>
        <div
          className={styles.input}
          data-open={open || undefined}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setOpen((o) => !o)
          }}
          aria-labelledby={labelId}
          aria-expanded={open}
          aria-controls="status-listbox"
          tabIndex={0}
        >
          {value.map((key) => {
            const entry = statusEntries.find((e) => e.key === key)
            return (
              <span
                key={key}
                className={styles.chip}
                data-variant={entry?.variant ?? 'neutral'}
              >
                {entry?.label ?? key}
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={(e) => remove(key, e)}
                  aria-label={`Remove ${entry?.label ?? key}`}
                >
                  &times;
                </button>
              </span>
            )
          })}
        </div>
        {open && (
          <div id="status-listbox" className={styles.dropdown} tabIndex={-1}>
            {statusEntries.map(({ key, label }) => {
              const id = `status-opt-${key}`
              const checked = value.includes(key)
              return (
                <div key={key} className={styles.option}>
                  <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={() => toggle(key)}
                  />
                  <label htmlFor={id}>{label}</label>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
