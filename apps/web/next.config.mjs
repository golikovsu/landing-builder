/** @type {import('next').NextConfig} */
const attributeBase = process.env.ATTRIBUTE_API_BASE

const nextConfig = {
  async rewrites() {
    // Only proxy if ATTRIBUTE_API_BASE is configured
    if (!attributeBase) return []

    return [
      // Attribution script API proxy
      {
        source: '/lp/attribute/:path*',
        destination: `${attributeBase}/lp/attribute/:path*`,
      },
      // Broker auth API proxy (register / login / recovery)
      {
        source: '/lp/auth/:path*',
        destination: `${attributeBase}/:path*`,
      },
    ]
  },
}

export default nextConfig
