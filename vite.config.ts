import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    root: './public',
    publicDir: '../public',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
    },
    server: {
        port: 3000,
        open: true,
        cors: true
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@frontend': path.resolve(__dirname, './src/frontend')
        }
    },
    css: {
        postcss: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer')
            ]
        }
    }
})
