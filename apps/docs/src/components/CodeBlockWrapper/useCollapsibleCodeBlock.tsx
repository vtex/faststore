import React, { useState } from 'react'
import styles from '@site/src/theme/Playground/styles.module.css'

export function useCollapsibleCodeBlock() {
  const [isCodeVisible, setCodeVisible] = useState(false)

  const handleToggleCodeBlock = () => setCodeVisible((prev: boolean) => !prev)

  return {
    isCodeVisible,
    ToggleCodeButton: () => (
      <button
        onClick={handleToggleCodeBlock}
        className={styles.playgroundButton}
      >
        <svg className={styles.IconCode} viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M8.7 15.9 4.8 12l3.9-3.9c.39-.39.39-1.01 0-1.4a.9839.9839 0 0 0-1.4 0l-4.59 4.59c-.39.39-.39 1.02 0 1.41l4.59 4.6c.39.39 1.01.39 1.4 0 .39-.39.39-1.01 0-1.4zm6.6 0 3.9-3.9-3.9-3.9a.9839.9839 0 0 1 0-1.4c.39-.39 1.01-.39 1.4 0l4.59 4.59c.39.39.39 1.02 0 1.41l-4.59 4.6c-.39.39-1.01.39-1.4 0a.9839.9839 0 0 1 0-1.4z"
          ></path>
        </svg>
        {isCodeVisible ? 'Hide' : 'Show'} code
      </button>
    ),
  }
}
