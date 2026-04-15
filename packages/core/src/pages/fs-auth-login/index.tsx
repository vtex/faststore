import { Button, InputField } from '@faststore/ui'
import { useRouter } from 'next/router'
import { type FormEvent, useState } from 'react'

import styles from './fs-auth-login.module.scss'

export default function PasswordProtectionLogin() {
  const router = useRouter()
  const returnTo =
    typeof router.query.returnTo === 'string' ? router.query.returnTo : '/'

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = new URL('/api/fs/auth/login', globalThis.location.origin)
      url.searchParams.set('returnTo', returnTo)

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success && data.redirectUrl) {
        globalThis.location.href = data.redirectUrl
      } else {
        setError(data.error ?? 'Invalid password')
      }
    } catch {
      setError('Service temporarily unavailable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.fsAuthLogin}>
      <div className={styles.page}>
        <h1 className={styles.title}>This store is password protected</h1>

        <h2 className={styles.subtitle}>
          Enter the password to access the store
        </h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <InputField
            id="fs-auth-password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            required
            disabled={loading}
            error={error || undefined}
          />
          <Button
            type="submit"
            variant="primary"
            size="small"
            disabled={loading}
            loading={loading}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}
