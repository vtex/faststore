import { useRouter } from 'next/router'
import { useState } from 'react'

export default function PasswordProtectionLogin() {
  const router = useRouter()
  const returnTo =
    typeof router.query.returnTo === 'string' ? router.query.returnTo : '/'

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = new URL('/api/fs/auth/login', window.location.origin)
      url.searchParams.set('returnTo', returnTo)

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl
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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
        Password protected
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          maxWidth: '20rem',
        }}
      >
        <label
          htmlFor="fs-auth-password"
          style={{ fontSize: '0.875rem', fontWeight: 500 }}
        >
          Password
        </label>
        <input
          id="fs-auth-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          autoComplete="current-password"
          required
          disabled={loading}
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Verifying…' : 'Login'}
        </button>
        {error && (
          <p style={{ color: '#b91c1c', fontSize: '0.875rem', margin: 0 }}>
            {error}
          </p>
        )}
      </form>
    </div>
  )
}
