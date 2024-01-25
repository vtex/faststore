import { Button } from '@faststore/ui'

import styles from './nova-pagina.module.scss'

function Page() {
  return (
    <div className={styles.checkout}>
      <aside>
        <Button variant="primary">Continue</Button>
      </aside>
    </div>
  )
}

export default Page
