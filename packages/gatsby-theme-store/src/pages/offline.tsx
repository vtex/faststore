import { Box, Flex, Container } from '@vtex/store-ui'
import React from 'react'

// Icon taken from https://commons.wikimedia.org/wiki/File:Offline_logo.svg.
const OfflineSvgIcon = (
  <svg viewBox="0 0 56.008221 56.314415" id="svg18605" version="1.1">
    <ellipse
      ry="28.2"
      rx="28"
      cy="28.2"
      cx="28"
      id="path3388-6"
      fill="#ffffff"
      fillOpacity={1}
      opacity={0}
    />
    <g fill="#000000" id="g6" transform="matrix(0.6,0,0,0.7,-2,-3.2)">
      <path
        fill="#000000"
        id="path8"
        d="M 84.5 16.6 L 73.7 27.4 C 50.8 18.2 23.6 22.9 5.1 41.4 l 6.4 6.4 C 26.4 33 47.8 28.5 66.6 34.5 l -7.4 7.4 c -14.4 -3 -30 1.1 -41.2 12.4 l 6.4 6.4 c 7.3 -7.3 17 -10.9 26.7 -10.6 l -11 11 c -3.4 1.3 -6.5 3.3 -9.3 6.1 l 1.6 1.6 l -11.6 11.4 l 3.5 3.5 L 88 20.1 L 84.5 16.6 Z"
      />
      <path
        fill="#000000"
        id="path10"
        d="M 43.6 80 l 6.4 6.4 l 6.4 -6.4 c -3.5 -3.6 -9.3 -3.6 -12.8 0 z"
      />
      <path
        fill="#000000"
        id="path12"
        d="M 46.6 68.6 c 5.7 -1.1 11.9 0.6 16.3 5 l 6.4 -6.4 C 65.4 63.3 60.5 60.8 55.5 59.8 l -8.9 8.8 z"
      />
      <path
        fill="#000000"
        id="path14"
        d="M 62.8 52.4 c 4.7 1.8 9.1 4.5 12.9 8.3 l 6.4 -6.4 C 78.4 50.6 74.2 47.6 69.7 45.5 l -6.9 6.9 z"
      />
      <path
        fill="#000000"
        id="path16"
        d="M 83.1 32.1 l -6.6 6.6 c 4.3 2.4 8.4 5.4 12.1 9.1 L 95 41.4 C 91.3 37.8 87.3 34.7 83.1 32.1 Z"
      />
    </g>
  </svg>
)

const Page = () => (
  <Container>
    <Flex sx={{ alignItems: 'center', flexDirection: 'column', padding: 2 }}>
      <div style={{ width: '150px', height: '150px' }}>{OfflineSvgIcon}</div>
      <Box
        as="h3"
        sx={{
          fontSize: '43px',
          fontWeight: '600',
          textAlign: 'center',
          color: 'primary',
          mt: '50px',
        }}
      >
        You are offline
      </Box>
      <Box
        as="p"
        sx={{
          paddingX: '15px',
          fontSize: '20px',
          textAlign: 'center',
          marginBottom: '30px',
        }}
      >
        Once your connection is back, you will be redirected to the page you
        were trying to visit.
      </Box>
    </Flex>
  </Container>
)

export default Page
