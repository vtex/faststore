import React, { useState, useRef, useCallback } from 'react'
import type { FormEvent } from 'react'

const toggleStyles = {
  width: '60px',
  height: '34px',
  borderRadius: '34px',
  backgroundColor: 'black',
  // position: 'relative',
  cursor: 'pointer',
}

const circleStyles = {
  height: '26px',
  width: '26px',
  backgroundColor: 'white',
  borderRadius: '50%',
  // margin: '4px 0 0 4px',
  // position: 'absolute',
  top: '14px',
  left: '30px',
}

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
      const parsedRes = JSON.parse(jsonRes.response)

      localStorage.setItem('searchTerm', JSON.stringify(parsedRes))

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
          style={{
            padding: '10px',
            minWidth: '450px',
            borderColor: '#ccc',
            borderWidth: '1px',
            borderRadius: '4px',
          }}
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="search-button"
          style={{ cursor: 'pointer' }}
        >
          {buttonText}
        </button>
      </div>
      {/* <div><input type='checkbox' />AI Search</div> */}
    </div>
  )
}

export default ContextSearchInput
