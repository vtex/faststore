import React, { useState } from 'react'
import styles from '@site/src/theme/Playground/styles.module.css'

export function useCopyCodeBlock(code: string) {
  const [isCodeCopied, setCodeCopied] = useState(false)

  const handleCopyCode = () => {
    if (!navigator) {
      return
    }

    navigator.clipboard.writeText(code)

    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 1000)
  }

  return {
    isCodeCopied,
    CopyCodeButton: () => (
      <button onClick={handleCopyCode} className={styles.playgroundButton}>
        <svg
          className={styles.IconCode}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <rect width="16rem" height="16rem" fill="none" />
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={18}
            d="M215.993 183.995V39.994H71.986"
          />
          <path
            strokeWidth={18}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            d="M39.986 71.995h144.006v144H39.986z"
          />
        </svg>
        {isCodeCopied ? 'Copied' : 'Copy code'}
      </button>
    ),
  }
}
