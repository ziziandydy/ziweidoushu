/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./src/frontend/**/*.{js,jsx,ts,tsx}",
        "./public/**/*.{html,js}"
    ],
    theme: {
        extend: {
            colors: {
                // 主色：朱砂（全站唯一強調色，主色 600）
                brand: {
                    50: '#FBF2EF',
                    100: '#F5E0D9',
                    200: '#EBC0B2',
                    300: '#DC9580',
                    400: '#D9785E',
                    500: '#B54E33',
                    600: '#9C3D25',
                    700: '#80321F',
                    800: '#64281A',
                    900: '#4A1E14',
                },
                // 中性色：帶墨紫色調的墨
                ink: {
                    50: '#F6F6F8',
                    100: '#ECECF0',
                    200: '#D9D9E0',
                    300: '#B9B9C4',
                    400: '#8C8C9B',
                    500: '#6A6A7A',
                    600: '#4E4E5C',
                    700: '#3A3A46',
                    800: '#26262F',
                    900: '#17171E',
                },
                // 錯誤狀態：比主色更正紅，且一律搭配圖示與文字
                danger: '#B42318',
            },
            fontFamily: {
                'sans': ['PingFang TC', 'Microsoft JhengHei', 'Noto Sans CJK TC', 'Noto Sans TC', 'system-ui', 'sans-serif'],
                'serif': ['var(--font-serif)', 'Songti TC', 'PMingLiU', 'serif'],
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
                'soft': '0 12px 32px -18px rgba(23, 23, 30, 0.28)',
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
        },
        require('@tailwindcss/typography'),
    ],
    // 暗黑模式配置
    darkMode: ['class', '[data-theme="dark"]'],
    // 容器配置
    corePlugins: {
        container: false,
    },
}

