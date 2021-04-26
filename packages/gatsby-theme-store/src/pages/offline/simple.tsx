/**
 * This page will be returned by our service worker in case a user goes offline,
 * then navigates into a page that triggers a fetch request for HTML to the server.
 *
 * Notice that the SimpleOfflinePage component should be very simple, since
 * React will not be available in the client once this page is rendered.
 * Functionalities such as 'useEffect' and 'useState' will NOT work.
 * In the context of this page, try to inline as much as possible.
 */

import React from 'react'

const SimpleOfflinePage = () => {
  return (
    <div
      style={{
        height: '100vh',
        maxWidth: '96rem',
        marginRight: 'auto',
        marginLeft: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{ width: '150px', height: '150px' }}>
          <svg viewBox="0 0 800 800">
            <path
              fill="#f71963"
              d="M656.59,186.14h-374c-29,0-47.57,30.83-34,56.46L286,313.44H218.18A24.94,24.94,0,0,0,196.12,350L316.45,577.75a24.94,24.94,0,0,0,44.08,0l32.68-61.52,41,77.62c14.43,27.3,53.52,27.35,68,.08L689.67,241.17C702.92,216.22,684.84,186.14,656.59,186.14Zm-168,150.72L407.76,489a16.6,16.6,0,0,1-29.33,0l-80.05-151.5A16.6,16.6,0,0,1,313,313.13H474.33A16.15,16.15,0,0,1,488.59,336.86Z"
            />
          </svg>
        </div>
        <h3
          style={{
            fontSize: '43px',
            fontWeight: 600,
            textAlign: 'center',
            color: '#0f3e99',
          }}
        >
          You are offline
        </h3>
        <p
          style={{
            paddingTop: '15px',
            paddingBottom: '15px',
            fontSize: '20px',
            textAlign: 'center',
            marginBottom: '30px',
          }}
        >
          Once your connection is back, try reloading this page or going back to
          where you were before.
        </p>
      </div>
    </div>
  )
}

export default SimpleOfflinePage
