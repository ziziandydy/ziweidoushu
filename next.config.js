/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Ensure we can still access the public folder assets easily
    // Next.js serves 'public' at root / by default, which matches our current structure

    // If we need to rewrite legacy API routes to the Vercel Functions (api/*)
    // In Vercel deployment, api/ folder functions are automatically served.
    // In `next dev`, we might need a way to proxy if we want to test API, 
    // but for now let's focus on the Frontend Pages.

    typescript: {
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // We do this temporarily during migration to avoid blocking builds on old code issues.
        ignoreBuildErrors: true,
    },

}

module.exports = nextConfig
