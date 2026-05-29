/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    typescript: {
        ignoreBuildErrors: true,
    },

    async redirects() {
        return [
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
