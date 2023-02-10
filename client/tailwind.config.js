/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#377dff',
                secondary: '#f6f7f8',
                dark: '#191c21',
                secondaryDark: '#212833',
                light: '#fff',
                text: '#596780',
            },
            keyframes: {
                ripple: {
                    '0%': {
                        boxShadow: '0 0 0 0px #44b700',
                    },
                    '100%': {
                        boxShadow: '0 0 0 3px transparent',
                    },
                },
                skeleton: {
                    '0%': {
                        backgroundColor: '#111',
                        origin: '0 0 0 0 1px',
                    },
                    '100%': {
                        backgroundColor: '#999',
                        origin: '0 0 0 0 1px',
                    }
                }
            },
            animation: {
                ripple: 'ripple 1.2s cubic-bezier(0, 0, 0.2, 1) infinite',
                skeleton: 'skeleton 1.5s linear infinite '

            },
        },
    },
    plugins: [require('tailwind-scrollbar')],
};