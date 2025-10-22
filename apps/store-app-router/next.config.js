const { withFastStore } = require('@vtex/faststore-core/with-faststore')

/** @type {import('next').NextConfig} */
const nextConfig = withFastStore({
  reactStrictMode: false,
})

module.exports = nextConfig
