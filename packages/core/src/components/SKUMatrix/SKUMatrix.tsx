import { useState } from 'react'

import {
  SKUMatrixSidebar as SKUMatrixSidebar,
  SKUMatrixTrigger as UISKUMatrixTrigger,
} from '@faststore/ui'
import styles from './section.module.scss'

interface SKUMatrixProps {
  button: {
    label: string
  }
}

function SKUMatrix({ button: { label } }: SKUMatrixProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div>
      <UISKUMatrixTrigger onClick={() => setIsOpen(true)}>
        {label}
      </UISKUMatrixTrigger>
      <SKUMatrixSidebar
        title="Galaxy S23 Ultra"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        overlayProps={{ className: styles.section }}
      >
        <ul>
          <li>Item 01</li>
          <li>Item 02</li>
          <li>Item 03</li>
          <li>Item 04</li>
        </ul>
      </SKUMatrixSidebar>
    </div>
  )
}

export default SKUMatrix
