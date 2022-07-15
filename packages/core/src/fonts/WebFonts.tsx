/* eslint-disable @next/next/no-page-custom-font */

import storeConfig from 'store.config'

function WebFonts() {
  return (
    // Replace this content with the <link> of your font-family of choice
    <>
      {storeConfig.theme === 'midnight' && (
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;700&display=swap"
        />
      )}
      {storeConfig.theme === 'soft-blue' && (
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap"
        />
      )}
    </>
  )
}

export default WebFonts
