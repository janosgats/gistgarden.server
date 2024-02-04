/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: "standalone",
    headers: () => [{
        source: '/(.*)',
        headers: [
            {
                key: 'Content-Security-Policy',
                value: "frame-ancestors 'none';",
            },
            {
                key: 'X-Frame-Options',
                value: "DENY",
            },
        ],
    }],
}

module.exports = nextConfig
