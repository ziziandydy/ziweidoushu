/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    typescript: {
        ignoreBuildErrors: true,
    },

    // api/ 下的 Vercel Functions 不會被 next dev 服務；開發時代理到 production API
    async rewrites() {
        if (process.env.NODE_ENV !== 'production') {
            return [{ source: '/api/:path*', destination: 'https://www.aiziwei.online/api/:path*' }];
        }
        return [];
    },

    async redirects() {
        return [
            {
                source: '/analysis',
                destination: '/zh-TW/analysis',
                permanent: false,
            },
            {
                source: '/analysis.html',
                destination: '/zh-TW/analysis',
                permanent: false,
            },
            {
                source: '/blog',
                destination: '/zh-TW/blog',
                permanent: false,
            },
            {
                source: '/blog/:slug',
                destination: '/zh-TW/blog/:slug',
                permanent: false,
            },
        ];
    },
}

module.exports = nextConfig
