import React from 'react'
import './welcome.css'
import PackageInfo from './../../package.json'

export const Welcome = () => {
  return (
    <div className="welcome__container">
      <h2 className="welcome__heading">Store UI v{`${PackageInfo.version}`}</h2>
      <p>
        A complete, framework agnostic library for building your next digital
        experience
      </p>
    </div>
  )
}
