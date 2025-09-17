/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*', // Incoming requests to /api/...
                destination: 'http://localhost:6200/api/:path*', // Proxy to Express backend
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http', // or 'https' depending on your backend
                hostname: 'localhost', // backend hostname
                port: '3001', // backend port
                pathname: '/**', // allow all images under /uploads
            },
        ],
    },
}

export default nextConfig
