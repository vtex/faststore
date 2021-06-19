import React from 'react'
import './welcome.css'
import PackageInfo from './../../package.json'

export const Welcome = () => {
  return (
    <div
      className="welcome__container"
      style={{
        background: `url() no-repeat center center fixed`,
        backgroundSize: 'cover',
      }}
    >
      <h2 className="welcome__heading">Store UI v{`${PackageInfo.version}`}</h2>
      <h4 className="welcome__heading welcome__heading--subtitle">
        A complete, framework agnostic library for building your next digital
        experience
      </h4>
    </div>
  )
}
