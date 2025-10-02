/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./src/frontend/**/*.{js,jsx,ts,tsx}",
        "./public/**/*.{html,js}"
    ],
    theme: {
        extend: {
            colors: {
                // 紫微斗數主題色
                zodiac: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7c3aed',
                    800: '#6b21a8',
                    900: '#581c87',
                },
                // 增強的藍色調
                blue: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                // 傳統中國色彩
                china: {
                    red: '#dc2626',      // 中國紅
                    gold: '#f59e0b',     // 金黃
                    jade: '#10b981',    // 玉綠
                    porcelain: '#f3f4f6', // 瓷白
                    ink: '#1f2937',     // 墨黑
                }
            },
            fontFamily: {
                'chinese': ['Microsoft YaHei', 'SimHei', 'SimSun', 'serif'],
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            fontSize: {
                '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1' }],
                '6xl': ['3.75rem', { lineHeight: '1' }],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'large': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'xl-soft': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'bounce-gentle': 'bounceGentle 2s infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                bounceGentle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            screens: {
                'xs': '475px',
                '3xl': '1600px',
            },
            zIndex: {
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100',
            },
            transitionTimingFunction: {
                'bounce-soft': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    },
    plugins: [
        // 自定義插件
        function ({ addUtilities, theme }) {
            const newUtilities = {
                // 文字漸變效果
                '.text-gradient-primary': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '-webkit-background-clip': 'text',
                    'background-clip': 'text',
                    '-webkit-text-fill-color': 'transparent',
                },
                '.text-gradient-gold': {
                    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                    '-webkit-background-clip': 'text',
                    'background-clip': 'text',
                    '-webkit-text-fill-color': 'transparent',
                },
                // 玻璃效應
                '.glass-effect': {
                    background: 'rgba(255, 255, 255, 0.25)',
                    'backdrop-filter': 'blur(10px)',
                    'border': '1px solid rgba(255, 255, 255, 0.18)',
                },
                '.glass-effect-dark': {
                    background: 'rgba(0, 0, 0, 0.1)',
                    'backdrop-filter': 'blur(10px)',
                    'border': '1px solid rgba(255, 255, 255, 0.1)',
                },
                // 縮放懸停效果
                '.hover-scale-gentle': {
                    transition: 'transform 0.2s ease-in-out',
                },
                '.hover-scale-gentle:hover': {
                    transform: 'scale(1.02)',
                },
                // 提升懸停效果
                '.hover-lift': {
                    transition: 'transform 0.2s ease-in-out',
                },
                '.hover-lift:hover': {
                    transform: 'translateY(-2px)',
                },
                // 自適應網格
                '.grid-responsive': {
                    'grid-template-columns': 'repeat(auto-fit, minmax(250px, 1fr))',
                },
                '.grid-responsive-sm': {
                    'grid-template-columns': 'repeat(auto-fit, minmax(200px, 1fr))',
                },
            }
            addUtilities(newUtilities)
        }
    ],
    // 暗黑模式配置
    darkMode: ['class', '[data-theme="dark"]'],
    // 容器配置
    corePlugins: {
        container: false,
    },
}

