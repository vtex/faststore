import { useEffect, useState } from 'react'

const OPTIONS = [
  ['off', 'API'],
  ['missing', 'sem priceState'],
  ['unavailable', 'indisponível'],
  ['gift', 'brinde 0'],
  ['priced', 'preço > 0'],
] as const

const PriceMockSwitchDev = () => {
  const [current, setCurrent] = useState('off')

  useEffect(() => {
    setCurrent(window.localStorage.getItem('fsPriceMock') ?? 'off')
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 10000,
        left: 80,
        bottom: 12,
        display: 'flex',
        gap: 4,
        padding: 8,
        background: '#111',
        color: '#fff',
        font: '12px sans-serif',
      }}
    >
      {OPTIONS.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => {
            if (id === 'off') {
              window.localStorage.removeItem('fsPriceMock')
            } else {
              window.localStorage.setItem('fsPriceMock', id)
            }

            window.location.reload()
          }}
          style={{
            background: current === id ? '#fff' : '#2a2a2a',
            color: current === id ? '#111' : '#fff',
            border: '1px solid #fff',
            borderRadius: 4,
            padding: '4px 8px',
            font: '12px sans-serif',
            fontWeight: current === id ? 700 : 400,
            cursor: 'pointer',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

const PriceMockSwitch = () => {
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return <PriceMockSwitchDev />
}

export default PriceMockSwitch
