/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*', // Incoming requests to /api/...
                destination: 'https://services.inspire-online.com/api/:path*', // Proxy to Express backend
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https', // or 'https' depending on your backend
                hostname: 'inspire-online.com', // backend hostname
                // port: '3001', // backend port
                pathname: '/**', // allow all images under /uploads
            },
        ],
    },
}

export default nextConfig
