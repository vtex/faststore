import React from 'react'
import './welcome.css'
import PackageInfo from './../../package.json'

export const Welcome = () => {
  return (
    <div className="welcome__container">
      <h2 className="welcome__heading">
        FastStore UI v{`${PackageInfo.version}`}
      </h2>
      <p>
        FastStore UI is an ecommerce-focused library that provides best-of-breed
        components, blazing-fast performance, and a frictionless development
        experience to create storefronts.
      </p>
    </div>
  )
}
