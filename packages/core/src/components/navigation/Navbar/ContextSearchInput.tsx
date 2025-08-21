import React, { useState, useRef, useCallback } from 'react'
import type { FormEvent } from 'react'

interface ContextSearchNavbarProps {
  placeholder?: string
  buttonText?: string
  onSearch?: (term: string) => void
  ariaLabel?: string
}

const ContextSearchInput = ({
  placeholder = 'Search products...',
  buttonText = 'Search',
  onSearch,
  ariaLabel = 'Search',
}: ContextSearchNavbarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/interact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: searchTerm,
        }),
      })
      const jsonRes = await response.json()

      localStorage.setItem('searchTerm', JSON.stringify(jsonRes))

      window.location.href = '/s'
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  return (
    <div className="navbar-search">
      <div className="search-input-container">
        <input
          ref={inputRef}
          type="search"
          value={searchTerm}
          onSubmit={handleSubmit}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="search-input"
        />
        <button type="submit" onClick={handleSubmit} className="search-button">
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default ContextSearchInput
