import { withFastStore } from '@faststore/core/with-faststore'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = withFastStore({
  reactStrictMode: false,
})

export default nextConfig
